import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as multihash from '../eth/multihash';
import { BondingCurveChart } from '../common';
import Trade from '../trade/trade.component';
import { ChanDate } from '../util';
import { toNumber, toFixed, calculateSaleReturn } from '../util';

import './meme.css';

class Meme extends Component {
  state = {
    reserveRatio: null,
    poolBalance: null,
    totalSupply: null,
    name: '',
    symbol: '',
    hash: null,
    img: '',
    bigImg: false
  };

  componentDidMount() {
    this.queryParams();
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts[0] !== prevProps.accounts[0]) {
      this.quaryParams();
    }
  }

  queryParams() {
    let contract = this.props.contracts[this.props.address];
    let controllerContract = this.props.contracts.Controller;
    let account = this.props.accounts[0];
    if (account) {
      contract.methods.balanceOf.cacheCall(account);
    }
    contract.methods.name.cacheCall();
    contract.methods.symbol.cacheCall();
    // controllerContract.methods.reserveRatio.cacheCall();
    contract.methods.poolBalance.cacheCall();
    contract.methods.totalSupply.cacheCall();
    controllerContract.methods.slope.cacheCall();
    controllerContract.methods.exponent.cacheCall();
  }

  static getDerivedStateFromProps(props, state) {
    let contract = props.contracts[props.address];
    let controllerContract = props.contracts.Controller;
    let account = props.accounts[0];

    let tokens = 0;
    if (account) {
      tokens = toNumber(contract.methods.balanceOf.fromCache(account), 18);
    }

    let updatedState = {
      name: contract.methods.name.fromCache(),
      symbol: (contract.methods.symbol.fromCache() || 'MEME').toUpperCase(),
      // reserveRatio: toNumber(controllerContract.methods.reserveRatio.fromCache(), 18),
      poolBalance: toNumber(contract.methods.poolBalance.fromCache(), 18),
      totalSupply: toNumber(contract.methods.totalSupply.fromCache(), 18),
      slope: toNumber(controllerContract.methods.slope.fromCache(), 0),
      exponent: toNumber(controllerContract.methods.exponent.fromCache(), 0),
      tokens
    };

    let ipfsImg;
    console.log('contract', contract);
    let event = contract.events[0];
    console.log('event', event);
    if (event) {
      console.log('event', event);
      ipfsImg = {
        hash: event.returnValues.memehash,
        hash_function: 18,
        size: 32
      };
      console.log(ipfsImg);
      updatedState.timestamp = event.returnValues.timestamp;
    }

    // assume hash does not update
    if (!state.hash && ipfsImg) {
      console.log(ipfsImg);
      let ipfsHash = multihash.getMultihashFromContractResponse(ipfsImg);
      updatedState.hash = ipfsHash;
    }
    return updatedState;
  }

  render() {
    let { state } = this;
    let { bigImg } = this.state;
    let contract = this.props.contracts[this.props.address];
    console.log(contract, state.hash, state.name);
    if (!contract || !(state.hash || state.name)) {
      return (
        <div className="meme">
          <div>
            Contract: <Link to={'/meme/' + this.props.address}>{this.props.address}</Link> (Loading)
          </div>
          <hr />
        </div>
      );
    }

    let saleReturn;
    if (state.tokens) {
      saleReturn = calculateSaleReturn({ ...this.state, amount: state.tokens });
    }
    return (
      <div className={'meme'}>
        <div>
          Contract: <Link to={'/meme/' + this.props.address}>{this.props.address}</Link>
        </div>
        <div className="memeContainer">
          <div
            className={'memeImage ' + (bigImg ? 'bigImg' : '')}
            onClick={() => this.setState({ bigImg: !bigImg })}
          >
            {state.hash ? <img src={'https://ipfs.infura.io/ipfs/' + state.hash} /> : null}
          </div>
          <div className="memeMeta">
            <div className="memeHeading">
              <input type="checkbox" disabled />
              <span className="subject">{state.name}</span>
              <span className="name">Anonymous</span>
              {ChanDate(state.timestamp)}
            </div>

            {state.symbol && <div>Ticker: {state.symbol} </div>}
            {
              <p>
                <b>Price: {(1 / state.slope) * state.totalSupply ** state.exponent} ETH</b>
              </p>
            }

            {/*            {<div>Pool balance: {state.poolBalance} </div>}
            {<div>Total supply: {state.totalSupply} </div>} */}

            {state.tokens ? (
              <p>
                <b>
                  You Own: {state.tokens} {state.symbol} ({saleReturn} ETH){' '}
                </b>
              </p>
            ) : null}
            <Trade address={this.props.address} contract={contract} showToggles />

            {this.props.showChart && <BondingCurveChart data={state} />}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

// wrapper which helps with unnecessary re-rendering
class MemeWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    let contract = this.props.contracts[this.props.address];
    let newContract = nextProps.contracts[nextProps.address];
    if (contract === newContract) {
      return false;
    }
    return true;
  }

  render() {
    let contract = this.props.contracts[this.props.address];
    if (!contract || !contract.initialized) return null;
    return <Meme {...this.props} />;
  }
}

const mapStateToProps = state => ({
  contracts: state.contracts,
  controllerContract: state.contracts.Controller,
  accounts: state.accounts
});

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemeWrapper);
