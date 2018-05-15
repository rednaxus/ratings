import React, { Component } from 'react'
import referralCode from '../../services/referralCode'

class AnalystReferrals extends Component {
  submitReferral( event, r){
    let { identity, regcode } = referralCode.getRefCodePair()
    console.log('got event ',r, identity, regcode )    
  }
  render() {
    const { analyst, timestamp } = this.props
    console.log('analystReferrals props',this.props)
    return (
      <div className="panel panel-success card card-style">

        { analyst.referred_by ? <div>Referred by: { analyst.referred_by }</div> : '' }
        <div className="panel-heading">
          <h4 className="card-title mt-3">Referrals</h4>
        </div>

        <div className="panel-body">
          { analyst.referrals.length ? 
            <div>
              <h4 className="row">Referrals Made</h4>
              <div className="row">
              { ['referral made','registered','email','id'].map( (txt, idx) => <div key={idx} className="col-md-3">{txt}</div> )}
              </div>
            </div> : ''
          }
          { analyst.referrals.map( ( referral, idx ) => // timestamp,reg_timestamp,email,analyst
            <div className="row infoRow" key={idx}>
              <div className="col-md-3"><Moment from={timestamp} date={referral.timestamp}/></div>
              <div className="col-md-3">{ referral.reg_timestamp ? <Moment from={timestamp} date={referral.reg_timestamp}/> : '' }</div>
              <div className="col-md-3">{ referral.email }</div>
              <div className="col-md-3">{ referral.analyst ? referral.analyst : '' }></div>
            </div>
          )}
          
          { analyst.referral_balance ? <div className="row">Referrals Available</div> : '' }
          { Array(analyst.referral_balance).fill().map( ( _, r ) => 
            <div className="row" key={r}>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  id={ `email-${r}` }
                  placeholder="Referral Email"
                  value=""
                />
              </div>
              <button className="col_md-6" onClick={ event => this.submitReferral( event, r ) }>
                submit
              </button>
            </div>
            )
          }
        </div>

      </div>
 
    )
  }
}

export default AnalystReferrals

