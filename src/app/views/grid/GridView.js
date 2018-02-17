// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'
import {
  AnimatedView
}                     from '../../components'

import { store } from '../../Root'


import Simple   from '../../components/grid/examples/Simple'
import CustomPager  from '../../components/grid/examples/custom-pager/CustomPager'
import getBulkSelectionSelectedRows 
  from '../../components/grid/examples/bulk-selection/getBulkSelectionSelectedRows'

class GridView extends Component {
  static propTypes= {
    actions: PropTypes.shape({
      enterGridView: PropTypes.func,
      leaveGridView: PropTypes.func
    })
  }

  constructor(props){
    super(props)
    this.loaded = false
  }

  componentWillReceiveProps(nextProps, nextState){
    // do this here because called on route change
    const capitalizeFirstLetter = string => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    if (!this.loaded || (nextProps.routing.location !== this.props.routing.location)) {
      this.loaded = true
      let feature = nextProps.routing.location.pathname.split('/')[2]
      //console.log('feature from route, app',feature, this.props.app.featureTitle)
      if (nextProps.app.featureTitle != feature) {
        this.props = nextProps
        this.props.actions.switchFeature(capitalizeFirstLetter(feature))
        return
      }
    }
    
    this.props = nextProps

  }

  shouldComponentUpdate(){
    return true
  }


  componentWillMount() {
    const { actions: { enterGridView } } = this.props
    enterGridView()
  }

  componentWillUnmount() {
    const { actions: { leaveGridView } } = this.props
    leaveGridView()
  }

  render() {

    const title = this.props.app.featureTitle; 

    const getGrid = (title) => {
      switch(title) {
        /*
        case "BulkSelection" :
         return (<BulkSelection { ...{ store } } />);
        case "Bootstrap" :
         return (<Bootstrap { ...{ store } } />);
        case "ColRenderer" :
         return (<ColRenderer { ...{ store } } />);
        case "Tree" :
         return (<Tree { ...{ store } } />);
        case "Stress" :
         return (<Stress { ...{ store } } />);
        case "Sticky" :
         return (<Sticky { ...{ store } } />);
        case "Editable" :
         return (<Editable { ...{ store } } />);
        case "Complex" :
         return (<Complex { ...{ store } } />);        
        case "CustomLoader" :
         return (<CustomLoader { ...{ store } } />);
        case "ErrorMessage" :
         return (<ErrorMessage { ...{ store } } />);
        */
        case "CustomPager" :
          return (<CustomPager { ...{ store } } />)
        case "Simple" :
        default :
         return (<Simple { ...{ store } } />)
      }
    }

    return (
      <AnimatedView>
        <div className="simpleContainer">
          <h2 className="gridH2">{this.props.app.featureTitle}</h2>
          { /*getBulkSelectionSelectedRows(this.props) */ }
          { getGrid(title) }
        </div>
      </AnimatedView>
    );
  }
}

export default GridView