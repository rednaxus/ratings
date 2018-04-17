import React from 'react'
import { Field, reduxForm } from 'redux-form'
import DropdownList from 'react-widgets/lib/DropdownList'
import SelectList from 'react-widgets/lib/SelectList'
import Multiselect from 'react-widgets/lib/Multiselect'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'
//import momentLocaliser from 'react-widgets/lib/localizers/moment'

import 'react-widgets/dist/css/react-widgets.css'
import validate from './validate';

//momentLocaliser(moment)

const colors = [
  { color: 'Red', value: 'ff0000' },
  { color: 'Green', value: '00ff00' },
  { color: 'Blue', value: '0000ff' }
]

const renderDropdownList = ({ input, data, valueField, textField }) => (
  <DropdownList
    {...input}
    data={data}
    valueField={valueField}
    textField={textField}
    onChange={input.onChange}
  />
)

const renderMultiselect = ({ input, data, valueField, textField }) => (
  <Multiselect
    {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    data={data}
    valueField={valueField}
    textField={textField}
  />
)

const renderSelectList = ({ input, data }) => (
  <SelectList {...input} onBlur={() => input.onBlur()} data={data} />
)

const renderDateTimePicker = ({ input: { onChange, value }, showTime }) => (
  <DateTimePicker
    onChange={onChange}
    format="DD MMM YYYY"
    time={showTime}
    value={!value ? null : new Date(value)}
  />
)


const Question = props => {
  const { handleSubmit, pristine, nextPage, previousPage, submitting, questionNumber, questionData } = props;
  console.log('question data',questionData)
  return (
    <form className="jurist-survey" onSubmit={handleSubmit}>
      <div>
        <label className="question-title">{questionData.name}</label>
        <div className="question-body">{questionData.title}</div>
        <Field
          name={"rating-"+questionNumber}
          component={renderSelectList}
          data={['1', '2', '3', '4', '5']}
        />
      </div>
      <div>
        <button type="button" className="previous" onClick={previousPage} >
          Previous
        </button>
        <button type="button" className="next" onClick={nextPage} >
          Next
        </button>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'jurist-survey', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})( Question )

