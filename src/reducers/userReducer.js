const initialState = {
    users: []
}

export function userReducer(state = initialState.users, action) {
    switch (action.type) {
        case 'USERS_FETCH_SUCCESS':
            return action.users;
        case 'ADD_USER':
            return [...state, action.user];
        case 'UPDATE_USER':
            let newState = state.slice(0);
            newState.splice(state.findIndex(u => u.id === action.user.id), 1, action.user);
            return newState;
        case 'CLEAR_USERS':
            return [];
        default:
            return state;
    }
}