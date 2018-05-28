import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Container, Tab } from 'semantic-ui-react';
import UserTable from './UserTable';
import LocalizedStrings from 'react-localization';

class Ranking extends Component {
  getUserGroups = () => {
    return this.props.groups.filter(group => {
      return group.creator === this.props.sessionUserId || group.members.some(member => member.id === this.props.sessionUserId);
    });
  }

  render() {
    let panes = [
      { menuItem: 'Gesamtrangliste', render: () => <Tab.Pane><UserTable users={this.props.users} sessionId={this.props.sessionUserId} searchable={true} /></Tab.Pane> }
    ];
    
    this.getUserGroups().forEach(group => {
      panes.push({ menuItem: group.name, render: () => <Tab.Pane key={group.id}><UserTable users={group.members} sessionId={this.props.sessionUserId} searchable={true} /></Tab.Pane> });
    });

    let strings = new LocalizedStrings({
      de: {
        title: "Rangliste"
      }
    }); 
    
    return (
      <Container>
        <Header size="large">{strings.title}</Header>
        <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} grid={{ paneWidth: 11, tabWidth: 5 }} className="vertical-tab" />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups,
    users: state.users,
    sessionUserId: state.session.user.id
  }
}

export default connect(mapStateToProps)(Ranking);
