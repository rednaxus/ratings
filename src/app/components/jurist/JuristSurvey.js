import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel } from 'react-bootstrap'
import Question from './Question'
import Moment from 'react-moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clearQuestionData, setQuestionData, setComplete } from '../../redux/modules/survey'
import { submitSurvey } from '../../redux/modules/rounds'
import survey from '../../services/survey'
import { surveyQuestions, surveyQuestion }     from '../../redux/modules/selectors'

/*
import json from '../../../../survey.json'

let indexer = {}
let index = 0
let elements = []
json.pages.forEach( page => page.elements.forEach( element => {
  elements.push(element)
  indexer[element.name] = index++ 
} ) )  

const encodeData = data => {
  let result = new Array(32)
  for (var name in data) 
    result[ indexer[name] ] = data[ name ]
  console.log('got result',data, result)
  return result
}
*/
let s = '****'


class JuristSurvey extends Component {
  constructor(props) {
    super(props)
    //this.survey = new Survey()
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = { page: 1 }
    this.onSubmit = this.onSubmit.bind( this )
    this.numAnswered = 0
    this.elements = survey.getElements()
  }
  onSubmit( a ) {
    let answers = this.props.questions.sort( (q1,q2) => q1.id - q2.id ).map( ( question,idx ) => Math.round(question.value * 100 / (this.elements[idx].maxRate || 5) ) )
    console.log(`survey submit with`,answers)
    this.props.onFinish( answers )
  }
  onValueChange(question,value,oldValue) {
    //console.log('value change',question,value)
    if (oldValue == value) return 
     
    if (!oldValue) this.numAnswered++
    else if (!value) this.numAnswered--
    //console.log(`${s}num answered ${this.numAnswered}`)
    this.props.setQuestionData( question, value )
  }
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { onSubmit, questions } = this.props
    const { page } = this.state
    //console.log('questions',questions) 
    this.numAnswered = 0
    return (
      <div>
          {this.elements.map( (element,idx) => {
            //let value = surveyQuestion(this.state,idx)
            let q = questions.find( question => question.id == idx )
            if (q && q.value > 0) this.numAnswered++
            //console.log(`${s}`,q)
            return ( 
              <Question
                key={idx}
                questionData={element} 
                questionNumber={idx}
                questionValue={q ? q.value : 0}
                onSubmit={this.nextPage} 
                previousPage={this.previousPage}
                nextPage={this.nextPage}
                onValueChange={ ( question, value, oldValue ) => this.onValueChange( question, value, oldValue ) }
              />
            )
          }
        )}


        <button className={`btn btn-primary`} disabled={this.numAnswered < this.elements.length} onClick={ (e) => this.onSubmit("hello") } >Submit Survey</button>
      </div>
    );
  }
}

JuristSurvey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ( {
  questions: surveyQuestions(state)
} )

const mapDispatchToProps = dispatch => bindActionCreators( {
  clearQuestionData,
  setQuestionData,
  setComplete,
  submitSurvey
}, dispatch )

export default connect( mapStateToProps, mapDispatchToProps )( JuristSurvey )
