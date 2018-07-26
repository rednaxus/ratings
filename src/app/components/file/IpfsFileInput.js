

import React from 'react'
import Dropzone from 'react-dropzone'
import IPFS from 'ipfs-api'

import toBuffer from 'blob-to-buffer'

import config from '../../config/appConfig'


class IpfsFileInput extends React.Component {
  constructor(props) {
    super(props)
    console.log('ipfs file input, props',props)
    this.onChange = this.onChange.bind(this)

    //this.url = config.ipfsRepoUpload // https://ipfs.io/' // just to bypass the check.

    this.node = null
    this.ipfsRepoName = props.ipfsRepoName || 'ipfs-dropzone'
    this.ipfsPath = file => file.name
    this.ipfs = IPFS( config.ipfsRepoUpload )
  }
 
  uploadFiles (files) {
    console.log('files uploading',files, this.ipfsRepoName)

    for (let file of files) {
      console.log('sending', file)
    }

    Promise.all([
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
    .then( ([ files, buffers ]) => {
      for (let i = 0; i < files.length; i++) {
        let buffer = buffers[i]
        let file = files[i]

        console.log('adding file',file,'at path',this.ipfsPath(file))
        this.ipfs.add({ 
          path:this.ipfsPath(file), 
          content: buffer
        }, { 
          progress: prog => {
            console.log(`progress: ${prog}`) 
            /*this._updateFilesUploadProgress([file], null, {
            loaded: loaded,
            total: file.size
            })
            */
          }
        }).then( response => {
          console.log(response)
          let ipfsId = response[0].hash
          console.log(ipfsId)
          file.ipfs = ipfsId
          this.ipfs.pin.add( ipfsId ).then( response => {
            console.log('pinned')
            //this.setState({added_file_hash: ipfsId})
            console.log('finished',file)
            if (this.props.onUploaded) this.props.onUploaded(file)
          }).catch( err => console.log('error pinning',err,file))
        }).catch( err => console.log('error processing',err, file) )
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
