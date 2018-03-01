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

  // userAuth:
  isAuthenticated: boolean,
  isFetching: boolean,
  isRegistering: boolean,
  disconnectUser: () => any,
  registerUserIfNeeded: () => any
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

    // userAuth:
    isAuthenticated: PropTypes.bool,
    isFetching:      PropTypes.bool,
    isRegistering:       PropTypes.bool,
    disconnectUser:  PropTypes.func.isRequired,
    registerUserIfNeeded: PropTypes.func.isRequired
  };
  // #endregion

  static defaultProps = {
    isFetching:      false,
    isRegistering:       false
  }

  state = {
    user:           '',
    email:          '',
    password:       ''
  };

  
  // #region lifecycle methods
  componentDidMount() {
    const {
      enterRegister,
      disconnectUser
    } = this.props;

    disconnectUser(); // diconnect user: remove token and user info
    enterRegister();
  }

  componentWillUnmount() {
    const { leaveRegister } = this.props;
    leaveRegister();
  }

  render() {
    const {
      user,
      email,
      password
    } = this.state;

    const {
      isRegistering
    } = this.props;

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
                        disabled={isRegistering}
                        onClick={this.handlesOnRegister} >
                        {
                          isRegistering
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
  handlesOnRegister = async (
    event: SyntheticEvent<>
  ) => {
    if (event) event.preventDefault();

    const {
      history,
      registerUserIfNeeded
    } = this.props;

    const {
      user,
      email,
      password
    } = this.state;
    console.log('state now',this.state)
    try {
      const response = await registerUserIfNeeded(user, email, password);
      console.log('response: ', response);
      console.log('state',this.state)
      console.log('props',this.props)
      /*
      const { data } = response.payload;
      const { token } = data;
      const {
        login,
        firstname,
        lastname,
        picture,
        showPicture
      } = data;
      const user = {
        login,
        firstname,
        lastname,
        picture,
        showPicture
      };
      */ 
      /*
      const { 
        token, 
        login, 
        firstname,
        lastname,
        picture,
        showPicture 
      } = this.props.userAuth
      const user = {
        login, 
        firstname, 
        lastname, 
        picture, 
        showPicture 
      }
      console.log('setting token and user',token,user)
      auth.setToken( token )
      auth.setUserInfo( user )
      */
      history.push({ pathname: '/login' }); // go to login screen
    } catch (error) {
      /* eslint-disable no-console */
      console.log('login went wrong..., error: ', error);
      /* eslint-enable no-console */
    }
  }
  // #endregion

  // #region on go back home button click callback
  goLogin = (
    event: SyntheticEvent<>
  ) => {
    if (event) {
      event.preventDefault();
    }

    const {
      history
    } = this.props;

    history.push({ pathname: '/login' });
  }
  // #endregion
}

export default Register
