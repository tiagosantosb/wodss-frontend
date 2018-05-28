const initialState = {
    matches: [],
    stage: 0
}

export function matchReducer(state = initialState.matches, action) {
    switch (action.type) {
        case 'MATCHES_FETCH_SUCCESS':
            return action.matches;
        case 'UPDATE_MATCH':
            let newState = state.slice(0);
            newState.splice(state.findIndex(m => m.id === action.match.id), 1, action.match);
            return newState;
        case 'CLEAR_MATCHES':
            return [];
        default:
            return state;
    }
}

export function stageReducer(state = initialState.stage, action) {
    switch (action.type) {
        case 'SET_STAGE':
            return action.stage;
        default:
            return state;
    }
}