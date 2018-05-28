import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import Login from '../Login';
import Signup from '../Signup';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import Games from '../games/Games';
import Groups from '../groups/Groups';
import Ranking from '../Ranking';
import Profile from '../Profile';
import WebSocket from '../WebSocket';
import Results from '../results/Results';
import { fetchBetDataFromServer } from '../actions/betActions';
import { fetchUserDataFromServer } from '../actions/userActions';
import { fetchTeamDataFromServer } from '../actions/teamActions';
import LocalizedStrings from 'react-localization';

class App extends Component {
  render() {
    let urls = new LocalizedStrings({
      de: {
        bets:"/tipps",
        groups:"/gruppen",
        ranking:"/rangliste",
        profile:"/profil",
        results:"/ergebnisse",
        signup:"/registrieren",
        forgotPassword:"/passwortvergessen",
        resetPassword:"/passwortvergessen/*"
      }
    });

    return (
      this.props.checked && 
      <Router>
        <div>
          <Navigation />
          <Container className="App-Container">
            {this.props.authenticated ? (
              <Switch>
                <Route path={urls.bets} component={Games} />
                <Route path={urls.groups} component={Groups} />
                <Route path={urls.ranking} component={Ranking} />
                <Route path={urls.profile} component={Profile} />
                <Route path={urls.results} component={Results} />
                <Route exact path="/" render={() => (<Redirect to={urls.bets} />)} />
                <Route render={() => (<Redirect to="/" />)} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path={urls.signup} component={Signup} />
                <Route exact path={urls.forgotPassword} component={ForgotPassword} />
                <Route path={urls.resetPassword} component={ResetPassword} />
                <Route render={() => (<Redirect to="/" />)} />
              </Switch>
            )}
            {this.props.authenticated ? ( <WebSocket /> ) : ''}
          </Container>
        </div>
      </Router>
    );
  }

  componentWillReceiveProps(props) {
    // initialize app data on login
    if(props.authenticated === true) {
      this.props.fetchBetData();
      this.props.fetchUserData();

      if(props.administrator) this.props.fetchTeamData();
    }
  }
}
  
const mapStateToProps = (state) => {
    return {
      authenticated: state.session.authenticated,
      administrator: state.session.user.admin,
      // flag whether the localstorage was checked for an existing session
      checked: state.session.checked
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserData: () => dispatch(fetchUserDataFromServer()),
    fetchBetData: () => dispatch(fetchBetDataFromServer()),
    fetchTeamData: () => dispatch(fetchTeamDataFromServer())
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(App);
