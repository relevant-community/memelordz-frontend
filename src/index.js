import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Web3ReactProvider } from '@web3-react/core';
import { useWeb3 } from './eth/hooks';
import { providers } from 'ethers';

import App from './app';

import { store, history } from './store';

function getLibrary(provider) {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 1000;
  library.poll = true;
  return library;
}

function InitWeb() {
  useWeb3();
  return null;
}

const root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectedRouter history={history}>
        <Fragment>
          <InitWeb />
          <App />
        </Fragment>
      </ConnectedRouter>
    </Web3ReactProvider>
  </Provider>,
  root
);
