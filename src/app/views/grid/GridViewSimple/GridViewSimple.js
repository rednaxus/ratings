// @flow weak

/* eslint no-console:0 */
import React, { PureComponent } from 'react'
import PropTypes      from 'prop-types'
import {
  AnimatedView
}                     from '../../../components'

import { store } from '../../../Root'

import SimpleGrid from '../../../components/grid/examples/Simple'

class GridViewSimple extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterGridViewSimple: PropTypes.func,
      leaveGridViewSimple: PropTypes.func
    })
  }

  componentWillMount() {
    this.props.actions.enterGridViewSimple();
  }

  componentWillUnmount() {
    this.props.actions.leaveGridViewSimple()
  }

  render() {
    return(
      <AnimatedView>

        <div>
          <SimpleGrid { ...{ store } }  />
        </div>
      </AnimatedView>
    );
  }
}

export default GridViewSimple
