import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Menu, Button, Label } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom';
import { logout } from '../actions/authActions';
import LocalizedStrings from 'react-localization';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    };
  }

  countJoinRequests = () => {
    let joinRequests = this.state.groups.map(group => (group.joinRequesters) ? group.joinRequesters.length : 0);
    return joinRequests.reduce((a, b) => a + b, 0);
  }

  logout = () => {
    this.props.performLogout();
  }

  render() {
    let strings = new LocalizedStrings({
      de: {
        siteTitle: "wodss Tippspiel",
        betsAnchor:"Tipps",
        groupsAnchor:"Gruppen",
        rankingAnchor:"Rangliste",
        profileAnchor:"Profil",
        resultsAnchor:"Ergebnisse",
        signupAnchor:"Registrieren",
        signinAnchor: "Login",
        logoutAnchor: "Logout"
      }
    });

    let urls = new LocalizedStrings({
      de: {
        bets:"/tipps",
        groups:"/gruppen",
        ranking:"/rangliste",
        profile:"/profil",
        results:"/ergebnisse",
        signup:"/registrieren"
      }
    });

    const styles = {
      navButton: { padding: '0.5em 1em', margin: '-6px 0.25em' },
      notificationLabel: { fontSize: '0.6em', padding: '0.3em 0.8em' }
    };
    
    const numberOfJoinRequests = this.countJoinRequests();

    return (
      <Menu fixed="top" stackable>
        <Container>
          <Menu.Item as={Link} to="/" header>{strings.siteTitle}</Menu.Item>
          {this.props.session.authenticated ? (
            <Menu.Menu position="right">
              <Menu.Item as={NavLink} to={urls.bets}>{strings.betsAnchor}</Menu.Item>
              <Menu.Item as={NavLink} to={urls.groups}>{strings.groupsAnchor}{numberOfJoinRequests > 0 ? <Label size="mini" color="red" style={styles.notificationLabel}>{numberOfJoinRequests}</Label> : ''}</Menu.Item>
              <Menu.Item as={NavLink} to={urls.ranking}>{strings.rankingAnchor}</Menu.Item>
              <Menu.Item as={NavLink} to={urls.profile}>{strings.profileAnchor}</Menu.Item>
              <Menu.Item>
                {this.props.session.user.admin ? (<Button style={styles.navButton} as={Link} primary to={urls.results}>{strings.resultsAnchor}</Button>) : ''}
                <Button style={styles.navButton} onClick={this.logout}>{strings.logoutAnchor}</Button>
              </Menu.Item>
            </Menu.Menu>
          ) : (
            <Menu.Menu position="right">
              <Menu.Item as={NavLink} exact to="/">{strings.signinAnchor}</Menu.Item>
              <Menu.Item as={NavLink} to={urls.signup}>{strings.signupAnchor}</Menu.Item>
            </Menu.Menu>
          )}
        </Container>
      </Menu>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ groups: nextProps.groups });
  }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        groups: state.groups
    }
}
  
const mapDispatchToProps = (dispatch) => {
  return {
    performLogout: () => dispatch(logout())
  }
}

// https://stackoverflow.com/questions/37123203/
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Navigation);
