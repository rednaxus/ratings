import React, { PureComponent } from 'react'
//import PropTypes from 'prop-types'
//import { Values } from "redux-form-website-template";
import { Panel } from 'react-bootstrap'
import { JuristSurvey } from '../../../components'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
async function showResults(values) {
  await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
}

class FormsView extends PureComponent {
  componentWillMount() {
    //this.props.actions.enterGeneral();
  }

  componentWillUnmount() {
    //this.props.actions.leaveGeneral();
  }

  render() {
    return(
      <Panel>
      	<Panel.Body>
      		<h2>Jurist Survey</h2>
      		<JuristSurvey onSubmit={showResults} />
      	</Panel.Body>
    	</Panel>
    )
  }
}

export default FormsView

