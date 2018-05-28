import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Form, Grid, Message } from 'semantic-ui-react';
import { signup } from './actions/authActions';
import LocalizedStrings from 'react-localization';
import ReCAPTCHA from 'react-google-recaptcha';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      recaptcha: '',
      error: false
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRecaptcha = (value) => {
    this.setState({ recaptcha: value });
  }

  handleSignup = () => {
    this.props.performSignup(this.state.email, this.state.name, this.state.password, this.state.recaptcha)
    .then(success => {
      if(!success) this.setState({ error: true });
    });
  }

  render() {
    const style = { maxWidth: '500px' };

    let strings = new LocalizedStrings({
      de: {
        title: "Registrieren",
        error: "Die angegebene E-Mail Adresse wird bereits verwendet.",
        email: "E-Mail",
        username: "Anzeigenamen",
        password: "Passwort",
        signup: "Registrieren"
      }
    }); 

    return (
      <Grid centered stretched>
        <Grid.Column mobile={16} tablet={14} computer={12} style={style}>
          <Form error={this.state.error} onSubmit={this.handleSignup}>
            <Header size="large">{strings.title}</Header>
            <Message error content={strings.error} />
            <Form.Input required type="email" name="email" fluid label={strings.email} placeholder={strings.email} icon="mail" iconPosition="left" value={this.state.email} onChange={this.handleChange} />
            <Form.Input required name="name" minLength="3" maxLength="20" fluid label={strings.username} placeholder={strings.username} icon="user" iconPosition="left" value={this.state.name} onChange={this.handleChange} />
            <Form.Input required name="password" minLength="8" fluid label={strings.password} placeholder={strings.password} type="password" icon="lock" iconPosition="left" value={this.state.password} onChange={this.handleChange} />
            <Form.Field>
              <ReCAPTCHA name="recaptcha" ref="recaptcha" sitekey="6Ld1mE4UAAAAALLweYV7uhxKSVilNostAUCgbZ8i" onChange={this.handleRecaptcha} />
            </Form.Field>
            <Form.Button primary>{strings.signup}</Form.Button>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSignup: (email, name, password, recaptcha) => dispatch(signup(email, name, password, recaptcha))
  }
}

export default connect(null, mapDispatchToProps)(Signup);