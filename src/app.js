import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import { PortisProvider } from 'portis';
import { drizzle, BondingCurveContract, getEthPrice } from './eth/drizzle.config';

import { AppLoader, Header, Footer } from './common';
import { MemeIndex, MemeShow } from './memes';
import actions from './actions';

// if (typeof web3 === 'undefined') {
//   let provider = new PortisProvider({
//     apiKey: '17d7077c4a5c6ad652a374149fca6a08',
//     network: 'rinkeby'
//   });
//   let Web3 = require('web3');
//   global.web3 = new Web3(provider);
//   web3.currentProvider.isMetaMask = true;
// }

class App extends Component {
  componentDidMount() {
    window.addEventListener(
      'hashchange',
      () => {
        window.scroll(0, 0);
        drizzle.contracts.ProxyFactory.syncEvents();
      },
      false
    );
    this.getEthPrice();
  }

  componentDidUpdate(lastProps) {
    if (this.props.ProxyFactory.events === lastProps.ProxyFactory.events) return;
    this.props.ProxyFactory.events.forEach(e => {
      let address = e.returnValues.proxyAddress;
      if (this.props.memes.indexOf(address) !== -1) return;
      drizzle.addContract(BondingCurveContract, {
        name: address,
        address,
        events: [
          {
            eventName: 'StoreHash',
            eventOptions: {
              fromBlock: e.blockNumber
            }
          }
        ]
      });
      this.props.actions.addMeme(address);
    });
  }

  getEthPrice() {
    getEthPrice()
      .then(price => {
        console.log('got eth price ', price);
        this.props.actions.setEthPrice(price);
      });
  }

  render() {
    return (
      <div className="container">
        <Header />
        <AppLoader>
          <Switch>
            <Route exact path="/" component={MemeIndex} />
            <Route exact path="/:board/" component={MemeIndex} />
            <Route exact path="/meme/:address" component={MemeShow} />
            <Route exact path="/:board/:page/" component={MemeIndex} />
            <Route exact path="/:board/:sort/:page/" component={MemeIndex} />
            <Route exact path="/:board/:sort/:page/:catalog/" component={MemeIndex} />
            <Route render={() => <div>404</div>} />
          </Switch>
        </AppLoader>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
  memes: state.memes.all
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions.memeActions, ...actions.ethActions }, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
