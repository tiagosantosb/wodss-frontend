import { sessionService } from 'redux-react-session';
import { deleteSession } from './authActions';

export function fetchUserDataFromServer() {
    return (dispatch) => {
        Promise.all([
            fetch(new Request('/api/users', {credentials: 'include'})), 
            fetch(new Request('/api/communities', {credentials: 'include'}))
        ])
        .then(([users, communities]) => {
            if(users.status === 200 && communities.status === 200) return Promise.all([users.json(), communities.json()]);
            else if (users.status === 401 || communities.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(([users, groups]) => {
            groups = resolveGroups(groups, users);
            dispatch({ type: 'USERS_FETCH_SUCCESS', users });
            dispatch({ type: 'GROUPS_FETCH_SUCCESS', groups });
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function changeUserNameOnServer(id, name) {
    return (dispatch) => {
        var request = new Request('/api/users/' + id, {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ name: name })
        });
        fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(user => {
            dispatch({ type: 'ADD_UPDATE', uuid: user.uuid });
            dispatch({ type: 'UPDATE_USER', user: user.object });
            sessionService.saveUser(user.object);
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function changeUserPasswordOnServer(id, oldPassword, newPassword) {
    return (dispatch) => {
        var request = new Request('/api/users/' + id, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(response => {
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}

function resolveGroups(groups, users) {
    // combine groups with users
    let resolvedGroups = [];
    groups.forEach(group => {
        resolvedGroups.push(resolveGroup(group, users));
    });
    return resolvedGroups;
}

export function resolveGroup(group, users) {        
    let resolvedGroup = group;
    resolvedGroup.members = resolveUsers([...group.members, group.creator], users);
    if(group.joinRequesters) {
        resolvedGroup.joinRequesters = resolveUsers(group.joinRequesters, users);
    }
    return resolvedGroup;
}

function resolveUsers(userIds, users) {
    let resolvedUsers = [];
    userIds.forEach(member => {
        resolvedUsers.push(users.find(user => user.id === member));
    });
    return resolvedUsers;
}
