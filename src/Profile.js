import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Container, Grid, Form, Icon, Card, Message } from 'semantic-ui-react';
import { changeUserNameOnServer, changeUserPasswordOnServer } from './actions/userActions';
import LocalizedStrings from 'react-localization';

class Profile extends Component {
  constructor(props) {
      super(props);
      this.state = { 
        name: '',
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
        success: false,
        error: false,
        nameModified: false
      };

      if(this.props.session.user.name !== undefined) {
        this.state.name = this.props.session.user.name;
      }
  }

  nameModified = (state) => {
    return this.props.session.user.name !== state.name;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ name: nextProps.session.user.name });
  }

  handleChange = (e) => {
    let input1 = document.getElementById('newPassword1');
    let input2 = document.getElementById('newPassword2');
    input2.setCustomValidity((input1.value !== input2.value) ? 'Die eingegebenen Passwörter stimmen nicht überein.' : '');

    let state = {...this.state};
    state[e.target.id] = e.target.value;
    state.nameModified = this.nameModified(state);
    this.setState(state);
  }

  changeUserName = () => {
    this.props.changeUserName(this.props.session.user.id, this.state.name);
    this.setState({ nameModified: false });
  }

  changeUserPassword = (e) => {
    this.props.changeUserPassword(this.props.session.user.id, this.state.oldPassword, this.state.newPassword1)
    .then(success => {
      if(success) {
        this.setState({ error: false, success: true });
        this.setState({ oldPassword: '', newPassword1: '', newPassword2: '' });
      } else {
        this.setState({ error: true, success: false });}
    });
  }

  render() {
    let strings = new LocalizedStrings({
      de: {
        title: "Profil",
        email: "E-Mail",
        username: "Anzeigenamen",
        changeUsername: "Anzeigenamen ändern",
        save: "Speichern",
        changePassword: "Passwort ändern",
        changePasswordSuccess: "Passwort erfolgreich geändert.",
        changePasswordError: "Ungültiges aktuelles Passwort.",
        currentPassword: "Aktuelles Passwort",
        newPassword: "Neues Passwort",
        repeatPassword: "Passwort wiederholen"
      }
    }); 

    const styles = {
      grid: { maxWidth: '500px' },
      icon: { margin: '0.5em 0.75em' }
    };
    
    return (
      <Container>
        <Grid centered stretched>
          <Grid.Column mobile={16} tablet={14} computer={12} style={styles.grid}>
            <Header size="large">{strings.title}</Header>
            <Card fluid>
              <Card.Content>
                <strong>{strings.email}</strong><br />
                <Icon name="mail" style={styles.icon} />
                <span>{this.props.session.user.email}</span>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>{strings.changeUsername}</Card.Header>
                <Card.Description>
                  <Form onSubmit={this.changeUserName}>
                    <Form.Input id="name"
                                fluid 
                                minLength="3" 
                                maxLength="20" 
                                label={strings.username} 
                                placeholder={strings.username} 
                                icon="user" 
                                iconPosition="left" 
                                value={this.state.name} 
                                onChange={this.handleChange} />
                    <Form.Button primary type="submit" disabled={!this.state.nameModified}>{strings.save}</Form.Button>
                  </Form>
                </Card.Description>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>{strings.changePassword}</Card.Header>
                <Card.Description>
                  <Form success={this.state.success} error={this.state.error} onSubmit={this.changeUserPassword}>
                    <Message success content={strings.changePasswordSuccess} />
                    <Message error content={strings.changePasswordError} />
                    <Form.Input id="oldPassword" 
                                required
                                fluid 
                                label={strings.currentPassword}
                                placeholder={strings.currentPassword}
                                type="password" 
                                icon="lock" 
                                iconPosition="left"
                                minLength="8"
                                value={this.state.oldPassword} 
                                onChange={this.handleChange} />
                    <Form.Input id="newPassword1" 
                                required
                                fluid 
                                label={strings.newPassword}
                                placeholder={strings.newPassword}
                                type="password" 
                                icon="lock" 
                                iconPosition="left" 
                                minLength="8"
                                value={this.state.newPassword1} 
                                onChange={this.handleChange} />
                    <Form.Input id="newPassword2" 
                                required
                                fluid 
                                label={strings.repeatPassword}
                                placeholder={strings.repeatPassword}
                                type="password" 
                                icon="lock" 
                                iconPosition="left"
                                minLength="8"
                                value={this.state.newPassword2} 
                                onChange={this.handleChange} />
                    <Form.Button primary type="submit">{strings.save}</Form.Button>
                  </Form>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeUserName: (id, name) => dispatch(changeUserNameOnServer(id, name)),
    changeUserPassword: (id, oldPassword, newPassword) => dispatch(changeUserPasswordOnServer(id, oldPassword, newPassword))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)