import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { Router } from './router';

import { store } from './store';

const dapp = document.createElement('div');
document.body.appendChild(dapp);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer>
      <Router />
    </AppContainer>
  </Provider>, dapp
);
