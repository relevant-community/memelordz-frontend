import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { drizzle } from './eth/drizzle.config';

import { history } from './store';

import { Header } from './common';

class App extends Component {
  componentDidUpdate(lastProps) {
    if (this.props.ProxyFactory.events === lastProps.ProxyFactory.events) return;
    // todo move this to meme component?
    this.props.ProxyFactory.events.forEach(e => {
      let address = e.returnValues.proxyAddress;
      console.log(e)
      // if (this.props.memes.indexOf(address) === -1) return;
      // drizzle.addContract(BondingCurveContract, {
      //   name: address,
      //   address,
      //   events: [{
      //     eventName: 'StoreHash',
      //     eventOptions: {
      //       fromBlock: e.blockNumber
      //     }
      //   }]
      // });
      // this.props.actions.addMeme(address);
    });
  }

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
  ProxyFactory: state.contracts.ProxyFactory || {},
  network: state.web3.networkId,
  status: state.web3.status,
  drizzleStatus: state.drizzleStatus.initialized,
  // memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...actions.memeActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
