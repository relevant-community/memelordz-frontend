import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { drizzle } from './eth/drizzle.config';

import { history } from './store';

import { AppLoader, Header } from './common';

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div className="parent">
          <Header />
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
  }
}

const mapStateToProps = (state) => ({
  account: state.accounts[0],
  ProxyFactory: state.contracts.ProxyFactory,
  network: state.web3.networkId,
  status: state.web3.status,
  drizzleStatus: state.drizzleStatus.initialized,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
