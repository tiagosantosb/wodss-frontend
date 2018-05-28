import { sessionService } from 'redux-react-session';

export function login(email, password) {
    return (dispatch) => {
        var request = new Request('/api/login', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }),
            credentials: 'include',
            body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password) 
        });
        return fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else return Promise.reject('Invalid Response');
        })
        .then(user => {
            // clear redux store
            dispatch({ type: 'CLEAR_BETS' });
            dispatch({ type: 'CLEAR_GROUPS' });
            dispatch({ type: 'CLEAR_MATCHES' });
            dispatch({ type: 'CLEAR_TEAMS' });
            dispatch({ type: 'CLEAR_USERS' });

            sessionService.saveSession({})
            .then(() => {
                sessionService.saveUser(user);
            });
            return true;
        })
        .catch(error => false);
    }
}

export function logout() {
    return (dispatch) => {
        return fetch('/api/logout')
        .then(response => {
            if(response.status === 200) {
                deleteSession();
                return true;
            }
            else return Promise.reject('Invalid Response');
        })
        .catch(error => false);
    }
}

export function deleteSession() {
    sessionService.deleteSession();
    sessionService.deleteUser();
}

export function signup(email, name, password, recaptcha) {
    return (dispatch) => {
        var request = new Request('/api/users', { 
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: email, name: name, password: password, 'g-recaptcha-response': recaptcha }) 
        });
        return fetch(request).then(response => {
            if(response.status === 201) return response.json();
            else return Promise.reject('Invalid Response');
        })
        .then(user => {
            return dispatch(login(email, password));
        })
        .catch(error => false);
    }
}

export function forgotPassword(email, recaptcha) {
    return (dispatch) => {
        var request = new Request('/api/users/passwordreset/request', { 
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: email, 'g-recaptcha-response': recaptcha }) 
        });
        return fetch(request).then(response => {
            if(response.status === 200) return true;
            else return Promise.reject('Invalid Response');
        })
        .catch(error => false);
    }
}

export function resetPassword(token, email, password) {
    return (dispatch) => {
        var request = new Request('/api/users/passwordreset', { 
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ token: token, email: email, newPassword: password }) 
        });
        return fetch(request).then(response => {
            if(response.status === 200) return true;
            else return Promise.reject('Invalid Response');
        })
        .catch(error => false);
    }
}
