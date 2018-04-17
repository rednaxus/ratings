import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Question from './Question'

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
        <Question 
          questionData={element} 
          questionNumber={page}
          onSubmit={this.nextPage} 
          previousPage={this.previousPage}
          nextPage={this.nextPage}
        />
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

export default JuristSurvey
