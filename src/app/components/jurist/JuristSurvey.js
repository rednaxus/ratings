import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel } from 'react-bootstrap'
import Question from './Question'
import Moment from 'react-moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clearData, setData, setComplete } from '../../redux/modules/survey'
import { submitSurvey } from '../../redux/modules/rounds'
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




class JuristSurvey extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
    };
  }
  onValueChange(question,value) {
    console.log('value change',question,value)
    //setData()
  }
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const { onSubmit } = this.props
    const { page } = this.state
    let element = elements[page]
    return (
      <div>
        <Panel>
          <Panel.Heading>Jurist Survey<span className="red small pull-right">Complete by: <Moment/></span></Panel.Heading>
          <Panel.Body className="question-panel">
          {elements.map( (element,idx) => 
            <Question
              questionData={element} 
              questionNumber={idx}
              onSubmit={this.nextPage} 
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              onValueChange={ (question,value) => this.onValueChange(question,value) }
            />)}
            <button>Submit Survey</button>
          </Panel.Body>
        </Panel>

        {/*
        {page === 1 && <WizardFormFirstPage onSubmit={this.nextPage} />}
        {page === 2 &&
          <WizardFormSecondPage
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />}
        {page === 3 &&
          <WizardFormThirdPage
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />}
        {page === 4 &&
          <WizardFormFourthPage
            previousPage={this.previousPage}
            onSubmit={onSubmit}
          />}
        */}
      </div>
    );
  }
}

JuristSurvey.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

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

//export default JuristSurvey
