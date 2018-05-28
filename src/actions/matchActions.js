import { deleteSession } from './authActions';

export function submitResultOnServer(id, match) {
    return (dispatch) => {
        var request = new Request('/api/matches/' + id, {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify(match)
        });
        fetch(request).then(response => {
            if(response.status === 200) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(match => {
            dispatch({ type: 'ADD_UPDATE', uuid: match.uuid });
            dispatch({ type: 'UPDATE_MATCH', match: match.object });
        })
        .catch(error => {
            console.log(error);
        });
    }
}