import React, { PureComponent } from 'react'
import { AnimatedView } from '../../components'
import FileInput from '../../components/file/FileInput'
import SimpleForm from '../../components/file/SimpleForm'
import Particles from 'react-particles-js'

export class FileUploader extends PureComponent {

  handleSubmit = () => {
    console.log("got submit")
  }

  render() {
    return(
      <main className="container">

        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Upload Brief</h1>
            <p>Drop your briefs here</p>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
          Test simple forms
          </div>
          <div className="panel-body">

            <SimpleForm onSubmit={this.handleSubmit} />
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
          Drop them
          </div>
          <div className="panel-body">
            <FileInput onChange={(files)=>console.log("here i am",files)}/>
          </div>
        </div>
      </main>
    )
  }
}




export default FileUploader
