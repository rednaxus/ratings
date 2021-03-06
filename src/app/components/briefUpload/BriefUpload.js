import React, { PureComponent } from 'react'
import { Panel } from 'react-bootstrap'

import { IpfsFileInput } from '../../components'
import { submitRoundBrief } from '../../services/API'

export class BriefUpload extends PureComponent {

  constructor(props) {
    super(props)
    this.onUploaded = this.onUploaded.bind(this)
  }

  handleSubmit = () => {
    console.log("got submit")
  }

  onUploaded = file => {
    console.log("brief uploaded",file)
    let hash = file.ipfs
    submitRoundBrief(this.props.round, this.props.roundAnalyst, hash).then( () => {
      console.log('brief uploaded',this.props.round,hash)
      if ( this.props.onComplete ) this.props.onComplete( hash )
    })
  }
  render() { 
    return (
      <Panel className="card card-style panel-active-large">
        <Panel.Heading className="card-title">Upload Brief -- drop it in the box</Panel.Heading>
        <Panel.Body className="card-text">
          <IpfsFileInput 
            onChange={(files)=>console.log("here i am",files)} 
            onUploaded={this.onUploaded}
          />
        </Panel.Body>
      </Panel>
  )}
}




export default BriefUpload
