import React from 'react'
import { Field, reduxForm } from 'redux-form'
import DropdownList from 'react-widgets/lib/DropdownList'
import { SelectList, Multiselect, DateTimePicker } from 'react-widgets'
//import Multiselect from 'react-widgets/lib/Multiselect'
//import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import Rating from 'react-rating'
import moment from 'moment'
//import momentLocaliser from 'react-widgets/lib/localizers/moment'
import { Panel } from 'react-bootstrap'
import 'react-widgets/dist/css/react-widgets.css'
import validate from './validate'

import Slider from '../slider'
//import { surveyQuestion } from '../../redux/modules/selectors'

let s = '***'

const Question = props => {
  const { handleSubmit, pristine, nextPage, previousPage, submitting, questionNumber, questionData, questionValue } = props
  //console.log('question data',state,surveyQuestion) 
  //let rating = surveyQuestion.value 

  const handleOnSliderChange = (value,oldValue) => {
    //console.log('slider change',value)
    if (props.onValueChange) props.onValueChange(questionNumber,value,oldValue)
  }

  //console.log(`${s}question value ${questionValue}`, questionNumber, questionData)
  //console.log(`${s}max,min rate`,questionData.maxRate, questionData.minRate)
  return (
    <div>
      <Panel className={`panel-active${questionValue?"":"-large"} card card-style`}>
        <Panel.Heading className={"card-title"}>{questionNumber+1}. {questionData.name}</Panel.Heading>
        <Panel.Body>
          <form className="jurist-survey" onSubmit={handleSubmit}>
            <div>
              <div className="question-body"><i className="fa fa-bar-chart fa-lg"/>{questionData.title}</div>
              <Slider
                value={questionValue}
                min={questionData.minRate || 0}
                max={questionData.maxRate || 5}
                step={0.1}
                orientation="horizontal"
                onChange={handleOnSliderChange}
              />
            </div>
          </form>
        </Panel.Body>
      </Panel>

 
    </div>
  )
}

export default reduxForm({
  form: 'jurist-survey', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})( Question )




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

const renderRating = ({ input, data }) => (
  <Rating   
    emptySymbol="fa fa-star-o fa-2x fat"
    fullSymbol="fa fa-star fa-2x fat"
    stop={data.length}
    {...input} 
    initialRate={parseInt(input.value)} 
  />
)

const renderSlider = ({ input, data }) => (
  <Slider
              value={data}
              min={0}
              max={5}
              orientation="horizontal"
              onChange={this.handleOnSliderChange}
            />
)
/*
const renderSelectListButtons
  <ButtonGroup>
    <Button>1</Button>
    <Button>2</Button>
    <Button>3</Button>
    <Button>4</Button>
  </ButtonGroup>
*/
const btnStyles = {
  border: '3px solid #f6e9db',
  background: 'transparent',
  borderRadius: '45px',
  width: '250px'
}

const btnSelectedStyles = {
  border: '3px solid #27313c',
  background: 'transparent',
  borderRadius: '45px',
  width: '250px'
}

const MultiSelectBtnGroup = ({ input, data }) => {
  let options = data
  const values = input.value || [];

  const handleClick = (value, select) => {
    var index = values.indexOf(value);

    if (select) {
      if (index === -1) {
          input.onChange([...values, value]);
      }
    } else {
      if (index !== -1) {
          input.onChange(values.filter(v => v !== value));
      }
    }
  }

  return (
    <div className="row">
      {options.map(o => {
        const selected = values.indexOf(o.value) !== -1;
        return (
          <div className="col">
            <div className="row m-auto rel">
              <button
                  type="button"
                  className="mb-1 p-3 ml-auto mr-auto"
                  style={selected ? btnSelectedStyles : btnStyles}
                  onClick={e => handleClick(o.value, !selected)}
              >
                {o.content}
                <span
                    style={{ position: 'absolute', right: '15px', top: 0, bottom: 0, margin: 'auto' }}
                    className="mb-1 d-flex justify-content-center align-items-center"
                >
                    {'zz'/*icons.plusIcon(selected)*/}
                </span>
              </button>

              <input
                type="hidden"
                name={name}
                value={o.value}
                checked={selected}
              />
            </div>
          </div>
        );
      })}
    </div>
  )
};

/*
const renderDateTimePicker = ({ input: { onChange, value }, showTime }) => (
  <DateTimePicker
    onChange={onChange}
    format="DD MMM YYYY"
    time={showTime}
    value={!value ? null : new Date(value)}
  />
)
*/
