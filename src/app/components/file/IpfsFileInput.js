

import React from 'react'
import Dropzone from 'react-dropzone'
import IPFS from 'ipfs'

import toBuffer from 'blob-to-buffer'

class IpfsFileInput extends React.Component {
  constructor(props) {
    super(props)
    console.log('ipfs file input, props',props)
    this.onChange = this.onChange.bind(this)

    this.url = 'https://ipfs.io/' // just to bypass the check.

    this.node = null
    this.ipfsRepoName = props.ipfsRepoName || 'ipfs-dropzone'
    this.ipfsPath = file => file.name
  }
 
  uploadFiles (files) {
    console.log('files uploading',files, this.ipfsRepoName)
    if (this.node === null) {
      this.node = new Promise((resolve) => {
        let node = new IPFS({ repo: this.ipfsRepoName })
        node.once('ready', () => {
          resolve(node)
        })
      })
    }

    for (let file of files) {
      console.log('sending', file)
    }

    Promise.all([
      this.node,
      files,
      Promise.all(
        files.map(f =>
          new Promise((resolve, reject) => {
            toBuffer(f, (err, buf) => {
              if (err) return reject(err)
              resolve(buf)
            })
          })
        )
      )
    ])
    .then(([node, files, buffers]) => {
      for (let i = 0; i < files.length; i++) {
        let buf = buffers[i]
        let file = files[i]

        console.log('adding file',file,'at path',this.ipfsPath(file))
        node.files.add({
          path: this.ipfsPath(file),
          content: buf
        }, {
          progress: loaded => {
            console.log('loaded',file)
            /*this._updateFilesUploadProgress([file], null, {
              loaded: loaded,
              total: file.size
            })
            */
          }
        }, (err, res) => {
          file.ipfs = res

          if (err) {
            console.log('error processing',file)
            //this._errorProcessing([file], `ipfs add error: ${err}`)
            return
          }
          console.log('finished',file)
          if (this.props.onUploaded)
            this.props.onUploaded(file)
          //this._finished([file])
        })
      }
    })
  }

  onChange(files) {
    // For Redux form
    if (this.props.input) {
      const {input: {onChange}} = this.props
      onChange(files[0])
    }
    else if(this.props.onChange){
        this.props.onChange(files[0])
        this.uploadFiles(files)
    }
    else{
        console.warn('redux-form-dropzone => Forgot to pass onChange props ?');
    }
  }

  render() {
    //<Dropzone onDrop={ this.onChange } {...this.props} />
 
    return (
      <Dropzone onDrop={ this.onChange } />
    )
  }
}
export default IpfsFileInput
