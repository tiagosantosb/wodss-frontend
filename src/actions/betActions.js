import { deleteSession } from './authActions';

export function fetchBetDataFromServer() {
    return (dispatch) => {
        Promise.all([
            fetch(new Request('/api/matches', {credentials: 'include'})), 
            fetch(new Request('/api/bets', {credentials: 'include'}))
        ])
        .then(([matches, bets]) => {
            if(matches.status === 200 && bets.status === 200) return Promise.all([matches.json(), bets.json()]);
            else if (matches.status === 401 || bets.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(([matches, bets]) => {
            dispatch({ type: 'SET_STAGE', stage: determineStage(matches) });
            dispatch({ type: 'MATCHES_FETCH_SUCCESS', matches: matches });
            dispatch({ type: 'BETS_FETCH_SUCCESS', bets: bets });
        })
        .catch(error => {
            console.log(error);
        });
    }
}

function determineStage(matches) {
    let upcomingMatch = matches.find(match => match.finished === false);
    let stage = (upcomingMatch === undefined) ? 0 : upcomingMatch.category - 1;
    return stage;
  }

export function setBetOnServer(bet) {
    return (dispatch, getState) => {
        const [uri, method] = (!getState().bets.some(b => b.matchId === bet.matchId)) ? ['/api/bets', 'POST'] : ['/api/bets/' + bet.id, 'PUT'];
        var request = new Request(uri, {
            method: method,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify(bet) 
        });
        fetch(request).then(response => {
            if(response.status === 200 || response.status === 201) return response.json();
            else if (response.status === 401) deleteSession();
            else return Promise.reject('Invalid Response');
        })
        .then(bet => {
            dispatch({ type: 'ADD_UPDATE', uuid: bet.uuid });
            dispatch({ type: 'SET_BET', bet: bet.object });
        })
        .catch(error => console.log(error));
    }
}