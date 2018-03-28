import React, { PureComponent } from 'react'
import { FileInput } from '../../components'

export class FileUploader extends PureComponent {

  handleSubmit = () => {
    console.log("got submit")
  }

  render() {
    return(
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
          Upload Briefs
          </div>
          <div className="panel-body">
            <FileInput onChange={(files)=>console.log("here i am",files)}/>
          </div>
        </div>
      </div>
    )
  }
}




export default FileUploader
