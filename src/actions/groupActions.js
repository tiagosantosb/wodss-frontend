import { resolveGroup } from './userActions';
import { deleteSession } from './authActions';

export function createGroupOnServer(name) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ name: name })
        });
        return fetch(request).then(response => {
            if(response.status === 201) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'CREATE_GROUP', group: resolveGroup(group.object, getState().users) });
            }
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}

export function createJoinRequestOnServer(group) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id + '/joinrequests', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 201) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            let resolvedGroup = resolveGroup(group.object, getState().users);
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolvedGroup });
            }
            return resolvedGroup;
        })
        .catch(error => {
            console.log(error);
            return group;
        });
    }
}

export function deleteJoinRequestOnServer(group, requester) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id + '/joinrequests/' + requester, {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            let resolvedGroup = resolveGroup(group.object, getState().users);
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolvedGroup });
            }
            return resolvedGroup;
        })
        .catch(error => {
            console.log(error);
            return group;
        });
    }
}

export function acceptJoinRequestOnServer(group, requester) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id + '/members', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ acceptMemberId: requester })
        });
        return fetch(request).then(response => {
            if(response.status === 201) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            let resolvedGroup = resolveGroup(group.object, getState().users);
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolvedGroup });
            }
            return resolvedGroup;
        })
        .catch(error => {
            console.log(error);
            return group;
        });
    }
}

export function declineJoinRequestOnServer(group, requester) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id + '/joinrequests/' + requester, {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            let resolvedGroup = resolveGroup(group.object, getState().users);
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolvedGroup });
            }
            return resolvedGroup;
        })
        .catch(error => {
            console.log(error);
            return group;
        });
    }
}

export function removeGroupMemberOnServer(group, memberId) {
    return (dispatch, getState) => {    
        var request = new Request('/api/communities/' + group.id + '/members/' + memberId, {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            let resolvedGroup = resolveGroup(group.object, getState().users);
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolvedGroup });
            }
            return resolvedGroup;
        })
        .catch(error => {
            console.log(error);
            return group;
        });
    }
}

export function deleteGroupOnServer(group) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id, {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 200) {
                dispatch({ type: 'DELETE_GROUP', id: group.id });
                return true;
            }
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}

export function leaveGroupOnServer(group, sessionUserId) {
    return (dispatch, getState) => {
        var request = new Request('/api/communities/' + group.id + '/members/' + sessionUserId, {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include'
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(group => {
            if(!getState().updates.some(update => update === group.uuid)) {
                dispatch({ type: 'ADD_UPDATE', uuid: group.uuid });
                dispatch({ type: 'UPDATE_GROUP', group: resolveGroup(group.object, getState().users) });
            }
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}
