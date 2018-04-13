import React, { Component } from 'react'
//import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clearData, setData, setComplete } from '../../redux/modules/survey'
import { submitSurvey } from '../../redux/modules/rounds'

import * as SurveyJS from 'survey-react'
// import SurveyEditor from './SurveyEditor';
import 'survey-react/survey.css'
import 'bootstrap/dist/css/bootstrap.css'
import json from '../../../../survey.json'

var model = new SurveyJS.Model(json)
//model.onValueChanged = () => {
//  console.log('test onValue')
//}
SurveyJS.Survey.cssType = "bootstrap"




class Survey extends Component {
  currentPage = 0
  isCompleted = false
  data = {}
  indexer = {} 
  constructor(props){
    super( props )
    let index = 0
    json.pages.forEach( page => page.elements.forEach( element => this.indexer[element.name] = index++ ) )    
    //console.log('indexer',this.indexer)
  }

  encodeData( data ) {
    let result = new Array(32)
    for (var name in data) 
      result[ this.indexer[name] ] = data[ name ]
    console.log('got result',data, result)
    return result
  }
  onValueChanged( model, options ) {
    console.log('on value change',model,options);

    this.props.setData( model.data )
  }
  onComplete(model, options) {
    console.log('on complete',model,options)
    this.props.setComplete( true )
    let dataToSend = this.encodeData( model.data )
    console.log('data to send',dataToSend)
    this.props.submitSurvey( 1, 1, 0, dataToSend )
  }
  onCurrentPageChanged( model, options ) {
    //console.log('current page changed',model,options)
    this.currentPage = model.currentPageNo
  }
  restart(){
    this.props.setComplete( false )
    this.currentPage = 0
    this.isCompleted = false
    this.data = {}
    this.props.clearData()
    this.forceUpdate()
  }
  render() {
    let props = this.props
    let onComplete = this.onComplete.bind(this)
    return (
      <div className="surveyjs">
        <SurveyJS.Survey 
          model={model}
          onComplete={ onComplete }
          onValueChanged={ this.onValueChanged.bind(this) }
          onCurrentPageChanged={ this.onCurrentPageChanged.bind(this) }
          currentPageNo={this.currentPage}
          isCompleted={this.isCompleted}
          data={this.data}
        />
        <button onClick={this.restart.bind(this)}>restart</button>
        <button onClick={ onComplete }>complete</button>
      </div>
    )
  }
}

const mapStateToProps = state => ( {
  data: state.survey.data
} )

const mapDispatchToProps = dispatch => bindActionCreators( {
  clearData,
  setData,
  setComplete,
  submitSurvey
}, dispatch )

export default connect( mapStateToProps, mapDispatchToProps )( Survey )
