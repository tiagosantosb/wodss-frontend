import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Container, Card, Input, Button, Table, Label, Message, Form } from 'semantic-ui-react';
import GroupModal from './GroupModal';
import { createGroupOnServer } from '../actions/groupActions';
import LocalizedStrings from 'react-localization';

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: this.sortGroups(this.props.groups),
      showModal: null,
      groupName: '',
      lastCreateWasSuccessful: true
    };
  }
  
  openModal = (id) => {
    this.setState({ showModal: id });
  }

  closeModal  = () => {
    this.setState({ showModal: null });
  }

  handleSearch = (e) => {
    this.setState({ groups: this.props.groups.filter(group => {
      return group.name.toLowerCase().search(e.target.value.toLowerCase()) > -1;
    })});
  }

  handleNameChange = (e) => {
    this.setState({ groupName: e.target.value });
  }

  handleCreate = () => {
    this.props.createGroup(this.state.groupName)
    .then(success => {
      if(success) this.setState({ groupName: '', lastCreateWasSuccessful: true });
      else this.setState({ lastCreateWasSuccessful: false });
    });
  }

  userIsCreator = (group) => {
    return group.creator === this.props.sessionUserId;
  }

  joinRequestPending = (group) => {
    return group.joinRequested;
  }

  userIsMember = (group) => {
    return !this.userIsCreator(group) && (group.members.find(member => member.id === this.props.sessionUserId) != null);
  }

  sortGroups = (groups) => {
    // sort groups creator > member > unrelated
    return groups.sort((a, b) => {
      let aScore = 0, bScore = 0;
      if(this.userIsCreator(a)) aScore += 3;
      if(this.userIsCreator(b)) bScore += 3;
      if(this.userIsMember(a)) aScore += 2;
      if(this.userIsMember(b)) bScore += 2;
      if(this.joinRequestPending(a)) aScore += 1;
      if(this.joinRequestPending(b)) bScore += 1;
      return bScore - aScore;
    });
  }

  render() {
    let strings = new LocalizedStrings({
      de: {
        title: "Tippgruppen",
        createNewGroup: "Eine neue Tippgruppe erstellen",
        groupname: "Gruppenname",
        nameError: "Der angegebene Gruppenname wird bereits verwendet.",
        createButton: "Erstellen",
        joinGroup: "Einer Tippgruppe beitreten",
        group: "Tippgruppe",
        search: "Suchen...",
        request: "Anfrage",
        requests: "Anfragen",
        creator: "Besitzer",
        requestPending: "Anfrage offen",
        member: "Mitglied",
        members: "Mitglieder"
      }
    }); 

    const styles = {
      label: { margin: '0 1em' },
      input: { width: '23em' },
      error: { maxWidth: '30em' }
    }
    
    return (
      <Container>
        <Header size="large">{strings.title}</Header>
        <Card fluid>
          <Card.Content>
            <Card.Header>{strings.createNewGroup}</Card.Header>
            <Card.Description>
              <Message error content={strings.nameError} hidden={this.state.lastCreateWasSuccessful} style={styles.error} />
              <Form onSubmit={this.handleCreate}>
                <Input action>
                  <Input required minLength="3" maxLength="20" placeholder={strings.groupname} icon="users" iconPosition="left" className="grouped-input-left" onChange={this.handleNameChange} style={styles.input} value={this.state.groupName} />
                  <div />
                  <Button primary disabled={this.state.groupName === ''} type="submit" icon="plus" content={strings.createButton} />
                </Input>
              </Form>
            </Card.Description>
          </Card.Content>
        </Card>
        <Card fluid>
          <Card.Content>
            <Card.Header>{strings.joinGroup}</Card.Header>
            <Card.Description>
              <Table selectable>
                <Table.Header fullWidth>
                  <Table.Row>
                    <Table.HeaderCell>{strings.group}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">
                      <Input icon="search" placeholder={strings.search} onChange={this.handleSearch} />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.groups.map(group => 
                    <Table.Row key={group.id} onClick={() => this.openModal(group.id)}>
                      <Table.Cell>{group.name}</Table.Cell>
                      <Table.Cell textAlign="right">
                        {(this.userIsCreator(group) && group.joinRequesters && group.joinRequesters.length > 0) ? (<Label color="red">{group.joinRequesters.length} {group.joinRequesters.length > 1 ? strings.requests : strings.request}</Label>) : ('')}
                        {this.userIsCreator(group) ? (<Label color="yellow" style={styles.label}>{strings.creator}</Label>) : ('')}
                        {this.joinRequestPending(group) ? (<Label color="orange" style={styles.label}>{strings.requestPending}</Label>) : ''}
                        {this.userIsMember(group) ? (<Label color="green" style={styles.label}>{strings.member}</Label>) : ''}
                        <Label color="blue" basic>{group.members.length + ' ' + (group.members.length === 1 ? strings.member : strings.members)}</Label>
                      </Table.Cell>
                      <GroupModal open={this.state.showModal === group.id} group={group} onClose={this.closeModal} />
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Card.Description>
          </Card.Content>
        </Card>
      </Container>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ groups: this.sortGroups(nextProps.groups) });
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createGroup: (name) => dispatch(createGroupOnServer(name))
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups,
    users: state.users,
    sessionUserId: state.session.user.id
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
