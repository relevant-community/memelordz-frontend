import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { history } from './store';

const Router = () => (
  <ConnectedRouter history={history}>
    <div className="parent">
      <App />
      <div className="container">
        <div>
          <Switch>
            <Route render={() => (<div>404</div>)} />
          </Switch>
        </div>
      </div>
    </div>
  </ConnectedRouter>
);

export { Router };
