import React, { Component } from 'react'
//import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clearData, setData, setComplete } from '../../redux/modules/survey'
import { submitSurvey } from '../../redux/modules/rounds'

import { Survey, Model } from 'survey-react'
// import SurveyEditor from './SurveyEditor';
import 'survey-react/survey.css'
import 'bootstrap/dist/css/bootstrap.css'
import json from '../../../../survey.json'

Survey.cssType = 'bootstrap'
var model = new Model( json )
var indexer = {}
let index = 0
json.pages.forEach( page => page.elements.forEach( element => indexer[element.name] = index++ ) )  

const encodeData = data => {
  let result = new Array(32)
  for (var name in data) 
    result[ indexer[name] ] = data[ name ]
  console.log('got result',data, result)
  return result
}

const onValueChanged = ( props, model ) => {
    //if (this.lastValue.name == options.name && this.lastValue.value == options.value) return  // not sure why this gets called multiple times
  console.log('on value change',model);
  //props.setData( model.data )
}

const onComplete = (props, model) => {
  console.log('on complete',model)
  props.setComplete( true )
  let answers = encodeData( model.data )
  console.log('data to send',answers)
    //this.props.submitSurvey( this.props.round, this.props.roundAnalyst, this.props.pre, answers )
}

class JuristSurvey extends Component {
  currentPage = 0
  isCompleted = false
  data = {}
  indexer = {} 
  model = {}
  completed = false // hack, for now
  lastValue = {}
  valueChanged
  constructor( props ){
    super( props )
  
    //console.log('indexer',this.indexer)
    //this.valueChanged = this.onValueChanged.bind(this)
  }

/*
  onValueChanged( model, options ) {
    //if (this.lastValue.name == options.name && this.lastValue.value == options.value) return  // not sure why this gets called multiple times
    console.log('on value change',model,options);
    this.lastValue = options
    this.props.setData( model.data )
  }

  onTestSend() {
    this.props.submitSurvey( this.props.round, this.props.roundAnalyst, this.props.pre, 
      this.encodeData( { "pedigree": "1", "critical skills": "3", "experience&accomplishments": "4", commitment: "4" } )
    )
  }
*/
  shouldComponentUpdate(nextProps,nextState){
    return false
  }
  onCurrentPageChanged( model, options ) {
    //console.log('current page changed',model,options)
    this.currentPage = model.currentPageNo
  }
  restart(){
    this.props.setComplete( false )
    this.currentPage = 0
    this.isCompleted = false
    this.completed = false
    this.data = {}
    this.props.clearData()
    this.forceUpdate()
  }
  render() {
    console.log('render')
    const { props, data } = this
    //let onComplete = this.onComplete // this.onComplete.bind(this)
    //let onValueChanged = testValueChanged //this.onValueChanged.bind(this)
    return (
      <div className="surveyjs">
        <Survey 
          model={model}
          onComplete={ (model, options) => {onComplete(props, model)} }
          onValueChanged={ (model, options) => {onValueChanged(props, model)} }
          //onValueChanged={ onValueChanged }
          //onCurrentPageChanged={ this.onCurrentPageChanged.bind(this) }
          currentPageNo={this.currentPage}
          isCompleted={this.isCompleted}
          completedHtml={'<div>thanks for <strong>finishing</strong></div>'}
          data={data}
        />
        <button onClick={ this.restart.bind(this) }>restart</button>
        {/*<button onClick={ this.onTestSend.bind(this) }>test-send</button>*/}
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

export default connect( mapStateToProps, mapDispatchToProps )( JuristSurvey )

