import { applyMiddleware, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { drizzleSagas } from 'drizzle';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import rootReducer from './reducers';
import { createBrowserHistory, createHashHistory } from 'history';

function* rootSaga() {
  yield all(drizzleSagas.map(saga => fork(saga)));
}

function configureStore(initialState = {}, history) {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
}

const history = createHashHistory();
const store = configureStore({}, history);

export { store, history };
