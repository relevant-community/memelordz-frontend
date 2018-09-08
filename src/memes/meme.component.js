import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Trade from '../trade/trade.component';
import { ChanDate } from '../util';
import * as multihash from '../eth/multihash';
import './meme.css';

class Meme extends Component {
  state = {
    poolBalance: null,
    totalSupply: null,
    name: '',
    symbol: '',
    hash: null,
    img: '',
  }

  componentDidMount() {
    this.queryParams();
  }

  queryParams() {
    let contract = this.props.contracts[this.props.address];
    contract.methods.name.cacheCall();
    contract.methods.symbol.cacheCall();
    contract.methods.poolBalance.cacheCall();
    contract.methods.totalSupply.cacheCall();
  }

  static getDerivedStateFromProps(props, state) {
    let contract = props.contracts[props.address];

    let updatedState = {
      name: contract.methods.name.fromCache(),
      symbol: (contract.methods.symbol.fromCache() || 'MEME').toUpperCase(),
      poolBalance: contract.methods.poolBalance.fromCache(),
      totalSupply: contract.methods.totalSupply.fromCache(),
    };

    let ipfsImg;
    let event = contract.events[0];
    if (event) {
      ipfsImg = {
        hash: event.returnValues.hash,
        hash_function: event.returnValues.hashFunction,
        size: event.returnValues.size,
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
    let contract = this.props.contracts[this.props.address];
    if (!contract || !(state.hash || state.name)) {
      return (
        <div className='meme'>
          <div>
            Contract: <Link to={'/meme/' + this.props.address}>{this.props.address}</Link> (Loading)
          </div>
          <hr />
        </div>
      );
    }
    console.log('render meme', this.props.address);
    return (
      <div className={'meme'}>
        <div>Contract: <Link to={'/meme/' + this.props.address}>{this.props.address}</Link>
        </div>
        <div className="memeContainer">
          <div className="memeImage">
            {state.hash ? <img src={'https://ipfs.infura.io/ipfs/' + state.hash} /> : null}
          </div>
          <div className="memeMeta">
            <div className="memeHeading">
              <input type='checkbox' disabled />
              <span className='subject'>{state.name}</span>
              <span className='name'>Anonymous</span>
              {ChanDate(state.timestamp)}
            </div>

            {state.symbol && <div>Ticker: {state.symbol} </div>}
            {state.poolBalance && <div>Pool balance: {state.poolBalance} </div>}
            {state.totalSupply && <div>Total supply: {state.totalSupply} </div>}

            <Trade address={this.props.address} contract={contract} />
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


const mapStateToProps = (state) => ({
  contracts: state.contracts,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeWrapper);
