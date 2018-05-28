import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from './actions/authActions';
import { Header, Form, Grid, Message } from 'semantic-ui-react';
import ReCAPTCHA from 'react-google-recaptcha';
import LocalizedStrings from 'react-localization';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      recaptcha: '',
      success: false
    }
  }

  handleSubmit = () => {
    this.props.forgotPassword(this.state.email, this.state.recaptcha)
    .then(success => {
      this.setState({ success: success });
    });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  handleRecaptcha = (value) => {
    this.setState({ recaptcha: value });
  }

  render() {
    const style = { maxWidth: '500px' };

    let strings = new LocalizedStrings({
      de: {
        title: "Passwort vergessen",
        email: "E-Mail",
        submit: "Absenden",
        success: "Eine E-Mail wurde an die angegebene Adresse versandt."
      }
    }); 

    return (
      <Grid centered stretched>
        <Grid.Column mobile={16} tablet={14} computer={12} style={style}>
          <Form success={this.state.success} onSubmit={this.handleSubmit}>
            <Header size="large">{strings.title}</Header>
            <Message success content={strings.success} />
            <Form.Input fluid required label={strings.email} name="email" placeholder={strings.email} icon="mail" iconPosition="left" onChange={this.handleChange} />
            <Form.Field>
              <ReCAPTCHA name="recaptcha" ref="recaptcha" sitekey="6Ld1mE4UAAAAALLweYV7uhxKSVilNostAUCgbZ8i" onChange={this.handleRecaptcha} />
            </Form.Field>
            <Form.Button primary>{strings.submit}</Form.Button>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: (email, recaptcha) => dispatch(forgotPassword(email, recaptcha))
  }
}

export default connect(null, mapDispatchToProps)(ForgotPassword);