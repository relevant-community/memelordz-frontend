import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import App from './app';

import { store, history } from './store';

const dapp = document.createElement('div');
document.body.appendChild(dapp);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppContainer>
        <App />
      </AppContainer>
    </ConnectedRouter>
  </Provider>, dapp
);
