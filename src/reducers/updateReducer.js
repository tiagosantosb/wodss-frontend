const initialState = {
    updates: []
}

export function updateReducer(state = initialState.updates, action, size = 100) {
    switch (action.type) {
        case 'ADD_UPDATE':
            if(state.length >= state.size) state.shift();
            return [...state, action.uuid];
        default:
            return state;
    }
}