import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Form, Grid, Message } from 'semantic-ui-react'
import { login } from './actions/authActions';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false
    }
  }

  handleSubmit = () => {
    this.props.performLogin(this.state.email, this.state.password)
    .then(success => {
      if(!success) this.setState({ error: true });
    });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    let urls = new LocalizedStrings({
      de: {
        forgotPassword:"/passwortvergessen"
      }
    });

    let strings = new LocalizedStrings({
      de: {
        title: "Login",
        error : "Ungültige E-Mail Adresse oder Passwort.",
        email: "E-Mail",
        password: "Passwort",
        login: "Anmelden",
        forgotPassword: "Passwort vergessen?"
      }
    }); 

    const style = { maxWidth: '500px' };

    return (
      <Grid centered stretched>
        <Grid.Column mobile={16} tablet={14} computer={12} style={style}>
          <Form error={this.state.error} onSubmit={this.handleSubmit}>
            <Header size="large">{strings.title}</Header>
            <Message error content={strings.error} />
            <Form.Input fluid label={strings.email} placeholder={strings.email} name="email" icon="mail" iconPosition="left" onChange={this.handleChange} />
            <Form.Input fluid label={strings.password} placeholder={strings.password} type="password" icon="lock" iconPosition="left" name="password" onChange={this.handleChange} />
            <Form.Button primary type="submit">{strings.login}</Form.Button>
            <Link to={urls.forgotPassword}>{strings.forgotPassword}</Link>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performLogin: (email, password) => dispatch(login(email, password))
  }
}

export default connect(null, mapDispatchToProps)(Login);