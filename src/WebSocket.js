import { connect } from 'react-redux';
import { Component } from 'react';
import { sessionService } from 'redux-react-session';
import { resolveGroup } from './actions/userActions';
import config from './config';

class WebSocket extends Component {
    // prevent rerender
    shouldComponentUpdate() {
        return false;
    }

    wasAlreadyProcessed(uuid) {
        return this.props.updates.some(update => update === uuid);
    }

    onUserUpdate = (body) => {
        const message = JSON.parse(body);
        switch(message.type) {
            case 'NEW_USER':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.addUser(message.uuid, message.object);
                break;
            case 'UPDATED_USER':
                sessionService.saveUser(message.object);
                break;
            case 'NEW_COMMUNITY':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.createCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                break;
            case 'UPDATED_COMMUNITY_JOINREQUESTS':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                break;
            case 'UPDATED_COMMUNITY':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                break;
            case 'DELETED_COMMUNITY':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.deleteCommunity(message.object.id);
                break;
            case 'UPDATED_MATCH':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateMatch(message.uuid, message.object);
                break;
            case 'NEW_BET':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.setBet(message.uuid, message.object);
                break;
            case 'UPDATED_BET':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.setBet(message.uuid, message.object);
                break;
            default:
                console.log('unknown message type: ' + message.type);
        }
    }

    onGlobalUpdate = (body) => {
        const message = JSON.parse(body);
        switch(message.type) {
            case 'NEW_COMMUNITY':
                if(message.object.creator !== this.props.sessionUserId) {
                    if(!this.wasAlreadyProcessed(message.uuid)) this.props.createCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                }
                break;
            case 'UPDATED_COMMUNITY_JOINREQUESTS':
                if(message.object.creator !== this.props.sessionUserId) {
                    if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                }
                break;
            case 'UPDATED_COMMUNITY':
                if(message.object.creator !== this.props.sessionUserId) {
                    if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateCommunity(message.uuid, resolveGroup(message.object, this.props.users));
                }
                break;
            case 'UPDATED_USER':
                if(message.object.id !== this.props.sessionUserId) {
                    if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateUser(message.uuid, message.object);
                }
                break;
            case 'UPDATED_USERS':
                if(!this.wasAlreadyProcessed(message.uuid)) this.props.updateUsers(message.uuid, message.object);
                break;
            default:
                this.onUserUpdate(body);
        }
    }

    render() {
        var Stomp = require('stompjs');
        var client = Stomp.client(config.websocketURL);
        client.connect(config.websocketURL);
        client.connect({}, () => {
            client.subscribe('/api/user/queue/userupdate', notification => this.onUserUpdate(notification.body));
            client.subscribe('/api/topic/globalupdate', message => this.onGlobalUpdate(message.body));
        });
        return '';
    }
}

const mapStateToProps = (state) => {
    return {
      users: state.users,
      updates: state.updates,
      sessionUserId: state.session.user.id
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        addUser : (uuid, user) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'ADD_USER', user })
        },
        updateUser : (uuid, user) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'UPDATE_USER', user })
        },
        updateUsers : (uuid, users) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'USERS_FETCH_SUCCESS', users })
        },
        createCommunity : (uuid, group) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'CREATE_GROUP', group });
        },
        updateCommunity : (uuid, group) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'UPDATE_GROUP', group })
        },
        deleteCommunity : (id) => dispatch({ type : 'DELETE_GROUP', id }),
        updateMatch : (uuid, match) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'UPDATE_MATCH', match })
        },
        setBet : (uuid, bet) => {
            dispatch({ type : 'ADD_UPDATE', uuid });
            dispatch({ type : 'SET_BET', bet })
        }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(WebSocket);