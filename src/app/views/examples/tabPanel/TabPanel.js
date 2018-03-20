// @flow weak

import React, {
  PureComponent
}                         from 'react'
import PropTypes          from 'prop-types'
import {
  AnimatedView,
  Panel,
  TabPanel            as TabPanelComponent,
  TabPanelHeader      as TabPanelHeaderComponent,
  TabPanelBody        as TabPanelBodyComponent,
  TabPanelBodyContent as TabPanelBodyContentComponent
}                         from '../../../components'


class TabPanel extends PureComponent {
  state = {
    mockHeader: [
      {name: 'Home', tablink: 'home', isActive: true},
      {name: 'About', tablink: 'about', isActive: false},
      {name: 'Profile', tablink: 'profile', isActive: false},
      {name: 'Contact', tablink: 'contact', isActive: false}
    ]
  };

  componentWillMount() {
    const { actions: { enterTabPanel } } = this.props;
    enterTabPanel();
  }

  componentWillUnmount() {
    const { actions: { leaveTabPanel } } = this.props;
    leaveTabPanel();
  }

  render() {
    const { mockHeader } = this.state;
    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-6 col-xs-offset-3">
            <Panel
              title="TabPanel"
              hasTitle={true}
              bodyBackGndColor={'#F4F5F6'}>
              <TabPanelComponent>
                <TabPanelHeaderComponent tabItems={mockHeader}/>
                <TabPanelBodyComponent>
                  <TabPanelBodyContentComponent id="home" isActive>
                    <h3>
                      Home
                    </h3>
                  </TabPanelBodyContentComponent>
                  <TabPanelBodyContentComponent id="about">
                    <h3>
                      About
                    </h3>
                  </TabPanelBodyContentComponent>
                  <TabPanelBodyContentComponent id="profile">
                    <h3>
                      Profile
                    </h3>
                  </TabPanelBodyContentComponent>
                </TabPanelBodyComponent>
              </TabPanelComponent>
            </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

TabPanel.propTypes= {
  actions: PropTypes.shape({
    enterTabPanel: PropTypes.func.isRequired,
    leaveTabPanel: PropTypes.func.isRequired
  })
};

export default TabPanel;
