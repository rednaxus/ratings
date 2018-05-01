import React, { PureComponent } from 'react'
import { Panel } from 'react-bootstrap'
import { IpfsFileInput } from '../../components'
import { submitBrief } from '../../services/API'

export class BriefUpload extends PureComponent {

  constructor(props) {
    super(props)
    this.onUploaded = this.onUploaded.bind(this)
  }

  handleSubmit = () => {
    console.log("got submit")
  }

  onUploaded = (files) => {
    console.log("files uploaded",files)
    let hash = files.ipfs[0].hash
    submitBrief(this.props.round, this.props.roundAnalyst, hash).then( () => {
      console.log('brief uploaded',this.props.round,files.ipfs[0].hash)
      if ( this.props.onComplete ) this.props.onComplete( files.ipfs[0].hash )
    })
  }
  render() { 
    return (
      <Panel>
        <Panel.Heading>Upload Brief -- drop it in the box</Panel.Heading>
        <Panel.Body>
          <IpfsFileInput 
            onChange={(files)=>console.log("here i am",files)} 
            onUploaded={this.onUploaded}
          />
        </Panel.Body>
      </Panel>
  )}
}




export default BriefUpload
