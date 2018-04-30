import React, { PureComponent } from 'react'
import { IpfsFileInput } from '../../components'

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
  }
  render() {
    return(
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
          Upload Briefs
          </div>
          <div className="panel-body">
            <IpfsFileInput 
              onChange={(files)=>console.log("here i am",files)} 
              onUploaded={this.onUploaded}/>
          </div>
        </div>
      </div>
    )
  }
}




export default BriefUpload
