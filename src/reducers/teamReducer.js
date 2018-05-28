const initialState = {
    teams: []
}

export function teamReducer(state = initialState.teams, action) {
    switch (action.type) {
        case 'TEAMS_FETCH_SUCCESS':
            return action.teams;
        case 'CLEAR_TEAMS':
            return [];
        default:
            return state;
    }
}