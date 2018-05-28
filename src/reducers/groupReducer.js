const initialState = {
    groups: []
}

export function groupReducer(state = initialState.groups, action) {
    switch (action.type) {
        case 'GROUPS_FETCH_SUCCESS':
            return action.groups;
        case 'CREATE_GROUP':
            return [...state, action.group];
        case 'UPDATE_GROUP':
            let newState = state.slice(0);
            let updateindex = state.findIndex(g => g.id === action.group.id);
            if(updateindex > -1) newState.splice(updateindex, 1, action.group);
            return newState;
        case 'DELETE_GROUP':
            let newState2 = state.slice(0);
            let deleteindex = state.findIndex(g => g.id === action.id);
            if(deleteindex > -1) newState2.splice(deleteindex, 1);
            return newState2;
        case 'CLEAR_GROUPS':
            return [];
        default:
            return state;
    }
}