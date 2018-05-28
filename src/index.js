import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { betReducer } from './reducers/betReducer';
import { userReducer } from './reducers/userReducer';
import { matchReducer, stageReducer } from './reducers/matchReducer';
import { groupReducer } from './reducers/groupReducer';
import { teamReducer } from './reducers/teamReducer';
import { updateReducer } from './reducers/updateReducer';
import 'semantic-ui-css/semantic.min.css';
import { sessionReducer, sessionService } from 'redux-react-session';

const initialState = {}

const wodssApp = combineReducers({
    session: sessionReducer,
    users: userReducer,
    matches: matchReducer,
    stage: stageReducer,
    bets: betReducer,
    groups: groupReducer,
    teams: teamReducer,
    updates: updateReducer
});

const store = createStore(wodssApp, initialState, applyMiddleware(thunk));

sessionService.initSessionService(store, { redurectPath: '/' });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
