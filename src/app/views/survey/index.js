import React, { Component } from 'react'
//import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setData, setCompleteFlag } from '../../redux/modules/survey'
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
  onValueChanged( model, options ) {
    console.log('on value change',model,options);
    this.props.setData( model.data )
  }
  onComplete(model, options) {
    console.log('on complete',model,options)
    this.props.setCompleteFlag( true )
    model.currentPage = 1
    model.render()
  }
  onCurrentPageChanged( sender, options ) {
    console.log('current page changed',sender,options)
    model.currentPage = 1
    model.render()
  }
  restart(){
    this.props.setCompleteFlag( false )
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
        />
        <button onClick={this.restart.bind(this)}>restart</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  data: state.survey.data
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setData,
  setCompleteFlag
}, dispatch)

export default connect( mapStateToProps, mapDispatchToProps )( Survey )
