import React, { Component } from 'react'
//import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clearData, setData, setComplete } from '../../redux/modules/survey'
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
  onValueChanged( model, options ) {
    //console.log('on value change',model,options);
    this.props.setData( model.data )
  }
  onComplete(model, options) {
    //console.log('on complete',model,options)
    this.props.setComplete( true )
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
    return (
      <div className="surveyjs">
        <SurveyJS.Survey 
          model={model}
          onComplete={ this.onComplete.bind(this) }
          onValueChanged={ this.onValueChanged.bind(this) }
          onCurrentPageChanged={ this.onCurrentPageChanged.bind(this) }
          currentPageNo={this.currentPage}
          isCompleted={this.isCompleted}
          data={this.data}
        />
        <button onClick={this.restart.bind(this)}>restart</button>
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
  setComplete
}, dispatch )

export default connect( mapStateToProps, mapDispatchToProps )( Survey )
