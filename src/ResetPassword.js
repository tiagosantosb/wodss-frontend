import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetPassword } from './actions/authActions';
import { Header, Form, Grid, Message } from 'semantic-ui-react';
import LocalizedStrings from 'react-localization';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            newPassword: '',
            success: false,
            error: false
        }
    }

    handleSubmit = () => {
        let token = window.location.pathname.match('^.*/(.*)$')[1];
        this.props.resetPassword(token, this.state.email, this.state.newPassword)
        .then(success => {
            this.setState({ success: success, error: !success });
            if(success) this.setState({ email: '', newPassword: '' });
        });
    }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const style = { maxWidth: '500px' };

    let strings = new LocalizedStrings({
      de: {
        title: "Passwort zurücksetzen",
        email: "E-Mail",
        submit: "Absenden",
        newPassword: "Neues Passwort",
        success: "Das Passwort wurde erfolgreich zurückgesetzt.",
        error: "Beim Zurücksetzen des Passworts ist ein Fehler aufgetreten."
      }
    }); 

    return (
      <Grid centered stretched>
        <Grid.Column mobile={16} tablet={14} computer={12} style={style}>
          <Form success={this.state.success} error={this.state.error} onSubmit={this.handleSubmit}>
            <Header size="large">{strings.title}</Header>
            <Message success content={strings.success} />
            <Message error content={strings.error} />
            <Form.Input fluid required label={strings.email} name="email" placeholder={strings.email} icon="mail" iconPosition="left" value={this.state.email} onChange={this.handleChange} />
            <Form.Input name="newPassword" 
                        required
                        fluid 
                        label={strings.newPassword}
                        placeholder={strings.newPassword}
                        type="password" 
                        icon="lock" 
                        iconPosition="left" 
                        minLength="8"
                        value={this.state.newPassword} 
                        onChange={this.handleChange} />
            <Form.Button primary>{strings.submit}</Form.Button>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (token, email, password) => dispatch(resetPassword(token, email, password))
  }
}

export default connect(null, mapDispatchToProps)(ResetPassword);