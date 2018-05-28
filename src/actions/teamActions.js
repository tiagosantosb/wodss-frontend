import { deleteSession } from './authActions';

export function fetchTeamDataFromServer() {
    return (dispatch) => {
        fetch(new Request('/api/teams', {credentials: 'include'}))
        .then((teams) => {
            if(teams.status === 200) return teams.json();
            else if (teams.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then((teams) => {
            dispatch({ type: 'TEAMS_FETCH_SUCCESS', teams });
        })
        .catch(error => {
            console.log(error);
        });
    }
}