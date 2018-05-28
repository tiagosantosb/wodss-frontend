import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Label, Button, Header, Confirm, Container } from 'semantic-ui-react';
import { setBetOnServer } from '../actions/betActions';
import UserTable from '../UserTable';
import JoinRequests from './JoinRequests';
import { createJoinRequestOnServer, deleteJoinRequestOnServer, deleteGroupOnServer, leaveGroupOnServer, removeGroupMemberOnServer } from '../actions/groupActions';
import { acceptJoinRequestOnServer, declineJoinRequestOnServer } from '../actions/groupActions';
import LocalizedStrings from 'react-localization';

class GroupModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          group: this.props.group,
          confirmDialog: false
      };
    }

    userIsCreator = () => {
        return this.state.group.creator === this.props.sessionUserId;
    }

    userIsMember = () => {
        return !this.userIsCreator(this.state.group) && (this.state.group.members.find(member => member.id === this.props.sessionUserId) != null);
    }

    userIsUnrelated = () => {
        return !this.userIsCreator(this.state.group) && !this.userIsMember(this.state.group);
    }

    requestJoin = () => {
        this.props.createJoinRequest(this.state.group)
        .then(group => this.setState({ group }));
    }

    withdrawRequest = () => {
        this.setState({ confirmDialog: false });
        this.props.deleteJoinRequest(this.state.group, this.props.sessionUserId)
        .then(group => this.setState({ group }));
    }

    deleteGroup = () => {
        this.setState({ confirmDialog: false });
        this.props.deleteGroup(this.state.group)
        .then((success) => {
            if(success) this.props.onClose();
        });
    }

    leaveGroup = () => {
        this.setState({ confirmDialog: false });
        this.props.leaveGroup(this.state.group, this.props.sessionUserId)
        .then((success) => {
            if(success) this.props.onClose();
        });
    }

    handleAccept = (requester) => {
        this.props.acceptJoinRequest(this.state.group, requester)
        .then(group => this.setState({ group }));
    }

    handleDecline = (requester) => {
        this.props.declineJoinRequest(this.state.group, requester)
        .then(group => this.setState({ group }));
    }

    handleMemberRemoval = (member) => {
        this.props.removeMember(this.state.group, member)
        .then(group => this.setState({ group }));
    }

    render() {
        const open = this.props.open;
        const onClose = this.props.onClose;
        const group = this.state.group;

        let strings = new LocalizedStrings({
            de: {
              disband: "Gruppe auflösen",
              confirmDisband: "Gruppe wirklich auflösen?",
              leave: "Gruppe verlassen",
              confirmLeave: "Gruppe wirklich verlassen?",
              yes: "Ja",
              no: "Nein",
              requestJoin: "Beitritt anfragen",
              withdrawRequest: "Anfrage zurückziehen",
              creator: "Besitzer",
              member: "Mitglied",
              members: "Mitglieder",
              joinRequests: "Offene Beitrittsanfragen"
            }
        }); 
  
        const styles = {
            header: { lineHeight: '1.8em' },
            subtitle: { margin: '0.5em 0 1em 0' }
        };

        return (
            <Modal open={open} onClose={onClose} size="tiny">
                <Modal.Header style={styles.header}>
                    {group.name}
                    {this.userIsCreator() || this.userIsMember() ? (<Button floated="right" icon="sign out" content={this.userIsCreator() ? strings.disband : strings.leave} color="red" onClick={() => this.setState({ confirmDialog: true })} />) : ''}
                    <Confirm
                        open={this.state.confirmDialog}
                        content={this.userIsCreator() ? strings.confirmDisband : strings.confirmLeave}
                        onCancel={() => this.setState({ confirmDialog: false })}
                        onConfirm={this.userIsCreator() ? this.deleteGroup : this.leaveGroup}
                        cancelButton={strings.no}
                        confirmButton={strings.yes}
                        size="mini"
                    />
                    {this.userIsUnrelated() && !group.joinRequested ? (<Button floated="right" icon="sign in" content={strings.requestJoin} color="green" onClick={this.requestJoin} />) : ''}
                    {this.userIsUnrelated() && group.joinRequested ? (<Button floated="right" icon="sign out" content={strings.withdrawRequest} color="orange" onClick={this.withdrawRequest} />) : ''}
                </Modal.Header>
                {this.userIsCreator() ? (<Label color="yellow" ribbon>{strings.creator}</Label>) : ''}
                {this.userIsMember() ? (<Label color="green" ribbon>{strings.member}</Label>) : ''}
                <Modal.Content>
                    {group.joinRequesters && group.joinRequesters.length > 0 ? (
                        <Container>
                            <Header size="small" style={styles.subtitle}>{strings.joinRequests}</Header>
                            <JoinRequests joinRequesters={group.joinRequesters} onAccept={this.handleAccept} onDecline={this.handleDecline} />
                            <Header size="small" style={styles.subtitle}>{strings.members}</Header>
                        </Container>
                    ) : ''}
                    <UserTable onRemove={this.handleMemberRemoval} isCreator={this.props.sessionUserId === group.creator} users={group.members} sessionId={this.props.sessionUserId} searchable={false} />
                </Modal.Content>
            </Modal>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ group: nextProps.group });
    }
}

const mapStateToProps = (state) => {
    return {
        sessionUserId: state.session.user.id
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGameBet: (id, bet) => dispatch(setBetOnServer(id, bet)),
    deleteGroup: (group) => dispatch(deleteGroupOnServer(group)),
    leaveGroup: (group, sessionUserId) => dispatch(leaveGroupOnServer(group, sessionUserId)),
    createJoinRequest: (group) => dispatch(createJoinRequestOnServer(group)),
    deleteJoinRequest: (group, requester) => dispatch(deleteJoinRequestOnServer(group, requester)),
    acceptJoinRequest: (groupId, requester) => dispatch(acceptJoinRequestOnServer(groupId, requester)),
    removeMember: (group, sessionUserId) => dispatch(removeGroupMemberOnServer (group, sessionUserId)),
    declineJoinRequest: (groupId, requester) => dispatch(declineJoinRequestOnServer(groupId, requester))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupModal);