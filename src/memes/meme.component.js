import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as multihash from '../eth/multihash';
import { BondingCurveChart, BlockHistory, BlockHash } from '../common';
import Trade from '../trade/trade.component';
import { toNumber, toFixed, ChanDate, calculateSaleReturn } from '../util';
import { drizzle } from '../eth/drizzle.config';

import './meme.css';

class Meme extends Component {
  state = {
    poolBalance: null,
    totalSupply: null,
    name: '',
    symbol: '',
    hash: null,
    img: '',
    bigImg: false,
    tokens: 0,
    events: {},
  };

  componentDidMount() {
    this.queryParams();
    if (this.props.singleView) {
      drizzle.contracts[this.props.address].syncEvent(null, 'Burned');
      drizzle.contracts[this.props.address].syncEvent(null, 'Minted');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts[0] !== prevProps.accounts[0]) {
      this.queryParams();
    }
  }

  queryParams() {
    let contract = this.props.contracts[this.props.address];
    let account = this.props.accounts[0];
    if (account) {
      contract.methods.balanceOf.cacheCall(account);
    }
    // console.log(contract.methods)
    contract.methods.name.cacheCall();
    contract.methods.symbol.cacheCall();
    contract.methods.poolBalance.cacheCall();
    contract.methods.totalSupply.cacheCall();
    contract.methods.slope.cacheCall();
    contract.methods.exponent.cacheCall();
  }

  static getDerivedStateFromProps(props, state) {
    let contract = props.contracts[props.address];
    let account = props.accounts[0];

    let tokens = 0;
    if (account) {
      tokens = toNumber(contract.methods.balanceOf.fromCache(account), 18);
    }

    let updatedState = {
      name: contract.methods.name.fromCache(),
      symbol: (contract.methods.symbol.fromCache() || 'MEME').toUpperCase(),
      poolBalance: toNumber(contract.methods.poolBalance.fromCache(), 18),
      totalSupply: toNumber(contract.methods.totalSupply.fromCache(), 18),
      slope: toNumber(contract.methods.slope.fromCache(), 0),
      exponent: toNumber(contract.methods.exponent.fromCache(), 0),
      tokens
    };

    let ipfsImg;
    let event = contract.events[0];
    if (event) {
      ipfsImg = {
        hash: event.returnValues.hash,
        hash_function: event.returnValues.hashFunction,
        size: event.returnValues.size
      };
      updatedState.timestamp = event.returnValues.timestamp;
    }

    // assume hash does not update
    if (!state.hash && ipfsImg) {
      let ipfsHash = multihash.getMultihashFromContractResponse(ipfsImg);
      updatedState.hash = ipfsHash;
    }

    return updatedState;
  }

  render() {
    let { state } = this;
    let { bigImg } = this.state;
    let contract = this.props.contracts[this.props.address];

    if (this.props.catalog) {
      return this.renderCatalog();
    }

    if (!contract || !(state.hash || state.name)) {
      return this.renderPlaceholder();
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
              <span className="subject"><Link to={'/meme/' + this.props.address}>{state.name}</Link></span>
              <span className="name">Anonymous</span>
              <BlockHash event={contract.events[0]} timestamp />
            </div>

            {state.symbol && <div>Ticker: {state.symbol} </div>}
            {
              <p>
                <b>
                  Price: {((1 / state.slope) * state.totalSupply ** state.exponent).toFixed(2)} ETH
                </b>
              </p>
            }

            {<div>Pool balance: {state.poolBalance && state.poolBalance.toFixed(2)} ETH</div>}
            {
              <div>
                Total supply: {state.totalSupply && state.totalSupply.toFixed(2)} {state.symbol}
              </div>
            }

            {state.tokens ? (
              <p>
                <b>
                  You Own: {state.tokens.toFixed(2)} {state.symbol} ({saleReturn.toFixed(2)} ETH){' '}
                </b>
              </p>
            ) : null}
            <Trade address={this.props.address} contract={contract} showToggles />

            {this.props.showChart && <BondingCurveChart data={state} />}
            {this.props.singleView && <BlockHistory symbol={state.symbol} contract={contract} showChart />}
          </div>
        </div>
        <hr />
      </div>
    );
  }

  renderPlaceholder() {
    return (
      <div className="meme">
        <div>
          Contract: <Link to={'/meme/' + this.props.address}>{this.props.address}</Link> (Loading)
        </div>
        <hr />
      </div>
    );
  }

  renderCatalog() {
    const { state } = this;
    let saleReturn;
    if (state.tokens) {
      saleReturn = calculateSaleReturn({ ...this.state, amount: state.tokens });
    }

    return (
      <div className='meme'>
        <Link to={'/meme/' + this.props.address}>
          {state.hash ? <img src={'https://ipfs.infura.io/ipfs/' + state.hash} /> : null}
        </Link>
        <br />
        <small>
          Price: {((1 / state.slope) * state.totalSupply ** state.exponent).toFixed(2)} ETH
          {' / '}
          {state.tokens ? (
            <span>
              You Own: {state.tokens.toFixed(2)} {state.symbol} ({saleReturn.toFixed(2)} ETH)
            </span>
          ) : null}
        </small>
        <br />
        <b>{state.name}</b>
      </div>
    );
  }
}

// wrapper which helps with unnecessary re-rendering
class MemeWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    let contract = this.props.contracts[this.props.address];
    let newContract = nextProps.contracts[nextProps.address];
    if (this.props.catalog !== nextProps.catalog) {
      return true;
    }
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
  accounts: state.accounts
});

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemeWrapper);
