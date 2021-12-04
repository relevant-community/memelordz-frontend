import { applyMiddleware, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import rootReducer from './reducers';
import { createHashHistory } from 'history';

function configureStore(initialState = {}, history) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware(history)))
  );

  return store;
}

const history = createHashHistory();
const store = configureStore({}, history);

export { store, history };
