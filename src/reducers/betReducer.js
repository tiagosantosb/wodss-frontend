const initialState = {
    bets: []
}

export function betReducer(state = initialState.bets, action) {
    switch (action.type) {
        case 'BETS_FETCH_SUCCESS':
            return action.bets;
        case 'SET_BET':
            let bet = state.find(b => b.id === action.bet.id);
            if(bet === undefined) {
                return [...state, action.bet];
            } else {
                let newState = state.slice(0);
                newState.splice(state.findIndex(m => m.id === action.bet.id), 1, action.bet);
                return newState;
            }
        case 'CLEAR_BETS':
            return [];
        default:
            return state;
    }
}