import React from 'react'
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
SurveyJS.Survey.cssType = "bootstrap"

const onValueChanged = (props, model) => {
  props.setData(model.data)
}

const onComplete = (props, model) => {
  props.setCompleteFlag(true)
}

const Survey = props => (
  <div className="surveyjs">
    <SurveyJS.Survey 
      model={model}
      onComplete={ (model, options) => {onComplete(props, model)} }
      onValueChanged={ (model, options) => {onValueChanged(props, model)} }
    />
  </div>
)

const mapStateToProps = state => ({
  data: state.survey.data
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setData,
  setCompleteFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Survey)
