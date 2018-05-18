// @flow weak

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Panel } from 'react-bootstrap'
import { appConfig } from '../../config'
import { Stat }                         from '../'

class AnalystStat extends PureComponent {


  render() {

    const { analyst } = this.props
    const levelInfo = appConfig.level_info( analyst.reputation )
    console.log('reputation',analyst.reputation,'levelInfo',levelInfo)
    return(
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Panel className="card card-style panel-success">
              <Panel.Heading className="card-heading">
                <h4 className="card-title mt-3">Analyst Summary
                  <span className="pull-right">Level: <span className={`profile-rank ${levelInfo.styles}`}>{ levelInfo.name }</span></span>
                </h4>
              </Panel.Heading>
              <Panel.Body>
                <div className="row">
                  <div className="col-md-4">
                    <Stat
                      statFaIconName="fa-recycle"
                      statIconColor="#fa8564"
                      statLabel={`${analyst.rounds.finished.length} Rounds Completed`}
                    />
                    {/*<Stat
                      statIoniconName="ion-md-alert"
                      statIconColor="#fa8564"
                      statLabel={`${analyst.rounds.finished.length} Rounds Completed`}
                    /> */}                 
                  </div>
                  <div className="col-md-4">
                    <Stat
                      statFaIconName="fa-certificate"
                      statIconColor="#45cf95"
                      statLabel={`${analyst.token_balance} Veva Tokens Earned`}
                    />
                  </div>
                  <div className="col-md-4">
                    <Stat
                      statFaIconName="fa-user-circle"
                      statIconColor="#AC75F0"
                      statLabel={`${analyst.num_referrals} Recruited Analysts`}
                    />
                  </div>
                </div>                
              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

AnalystStat.propTypes= {
  actions: PropTypes.shape({
    enterAnalystStat: PropTypes.func.isRequired,
    leaveAnalystStat: PropTypes.func.isRequired
  })
};

export default AnalystStat


/*
              { 
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-check-square-o"
                    statIconColor="#45cf95"
                    statLabel="1000 Tasks"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-dollar"
                    statIconColor="#AC75F0"
                    statLabel="$99999 Earnings"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-refresh"
                    statIconColor="#fa8564"
                    statIconSpin={true}
                    statLabel="Processing...."
                  />
                </div> 
  */
