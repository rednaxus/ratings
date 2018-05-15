// @flow

// #region imports
import React, { PureComponent }                     from 'react'
import PropTypes      from 'prop-types'
import { Row, Col, Button }                     from 'react-bootstrap'
import auth           from '../../services/auth'
// #endregion

// #region flow types
type Props = {
  // react-router 4:
  match: any,
  location: any,
  history: any,

  // views props:
  currentView: string,
  enterRegister: () => void,
  leaveRegister: () => void,

  isFetching: boolean,
  registering: boolean,
  logout: () => any,
  register: () => any
};

type State = {
  user: string,
  email: string,
  password: string
}
// #endregion

class Register extends PureComponent<Props, State> {
  // #region propTypes
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views props:
    currentView:    PropTypes.string.isRequired,
    enterRegister:  PropTypes.func.isRequired,
    leaveRegister:  PropTypes.func.isRequired,

    isFetching:      PropTypes.bool,
    registering:       PropTypes.bool,
    logout:  PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
  };
  // #endregion

  static defaultProps = {
    isFetching:      false,
    registering:       false
  }

  state = {
    user:           '',
    email:          '',
    password:       '',
    regcode:        '' 
  };

  
  // #region lifecycle methods
  componentDidMount() {
    const { enterRegister, logout } = this.props
    logout() // diconnect user: remove token and user info
    enterRegister()
  }


  componentWillReceiveProps() {
    if (this.state.regcode == this.props.match.params.regcode ) return

    this.state.regcode = this.props.match.params.regcode
    console.log('component will receive props',this.state.regcode) 
  }

  componentWillUnmount() {
    const { leaveRegister } = this.props
    leaveRegister()
  }

  render() {
    const { user, email, password, regcode } = this.state

    const { registering } = this.props

    return (
      <div>
        <div className="content">
          <Row>
            <Col md={4} mdOffset={4} xs={10} xsOffset={1} >
              <form className="form-horizontal" noValidate >
                <fieldset>
                  <legend className="text-center" >
                    <h1><i className="fa fa-3x fa-user-circle" aria-hidden="true" /></h1>
                    <h2>Register</h2>
                  </legend>

                  <div className="form-group">
                    <label htmlFor="inputUser" className="col-lg-2 control-label">User</label>
                    <div className="col-lg-10">
                      <input
                        type="text"
                        className="form-control"
                        id="inputUser"
                        placeholder="User name"
                        value={user}
                        onChange={this.handlesOnUserChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
                    <div className="col-lg-10">
                      <input
                        type="text"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Email"
                        value={email}
                        onChange={this.handlesOnEmailChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
                    <div className="col-lg-10">
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={this.handlesOnPasswordChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Col lg={10} lgOffset={2} >
                      <Button
                        className="login-button btn-block"
                        bsStyle="primary"
                        disabled={registering}
                        onClick={this.handlesOnRegister} >
                        {
                          registering
                            ?
                            <span>registering...&nbsp;<i className="fa fa-spinner fa-pulse fa-fw" /></span>
                            :
                            <span>Register</span>
                        }
                      </Button>
                    </Col>
                  </div>
                </fieldset>
              </form>
            </Col>
          </Row>
          <Row>
            <Col md={4} mdOffset={4} xs={10} xsOffset={1} >
              <div className="pull-right" >
                <Button bsStyle="default" onClick={this.goLogin} >login</Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
  // #endregion

  // #region form inputs change callbacks
  handlesOnUserChange = (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
      console.log('on user change')
      // should add some validator before setState in real use cases
      this.setState({ user: event.target.value.trim() });
      console.log('state',this.state)
    }
  }

  handlesOnEmailChange = (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() });
    }
  }

  handlesOnPasswordChange = (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ password: event.target.value.trim() });
    }
  }
  // #endregion


  // #region on register button click callback
  handlesOnRegister = async ( event: SyntheticEvent<> ) => {
    if (event) event.preventDefault()

    const { register } = this.props
    console.log('state on register',this.state)
    const { user, email, password } = this.state

    register(user, email, password)
  }

  goLogin = ( event: SyntheticEvent<> ) => {
    if (event) event.preventDefault()
    const { history } = this.props

    history.push({ pathname: '/login' })
  }
}

export default Register
