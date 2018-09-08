import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { calculateSaleReturn } from '../util';

class MemeLeaderboard extends Component {
  state = {
    sorted: [],
  }

  componentDidMount() {
    this.queryParams();
  }

  queryParams() {
    this.props.ProxyFactory.events.forEach(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      let contract = this.props.contracts[address];
      if (!contract || !contract.methods) return;
      contract.methods.name.cacheCall();
      contract.methods.symbol.cacheCall();
      contract.methods.poolBalance.cacheCall();
      contract.methods.totalSupply.cacheCall();
    });
  }

  static getDerivedStateFromProps(props, state) {
    let { events } = props.ProxyFactory;
    let sorted = events.map(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      let contract = props.contracts[address];
      if (!contract || !contract.methods) return null;
      let contractCache = {
        poolBalance: contract.methods.poolBalance.fromCache(),
        totalSupply: contract.methods.totalSupply.fromCache(),
        exponent: contract.methods.exponent.fromCache(),
        slope: contract.methods.slope.fromCache(),
        amount: contract.methods.totalSupply.fromCache(),
      };
      const price = calculateSaleReturn(contractCache) || 0;
      return [price, address];
    }).filter(a => !!a).sort((a, b) => a[0] - b[0]);
    state.sorted = sorted;
    return state;
  }

  render() {
    if (!this.props.ProxyFactory.events || this.props.ProxyFactory.events.length === 0) {
      return (
        <div>
          <hr />
          <div className='loadingMessage'>
            Loading memes...
          </div>
        </div>
      );
    }

    let { events } = this.props.ProxyFactory;
    let memes = events.map(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      return <Meme key={address} address={address} />;
    });

    if (this.state.sort === 'recent') {
      memes.reverse();
    }

    return (
      <div>
        <hr />
          <Create />
        <hr />
        <div className='sortLinks'>
          Sort memes by:
          <Link to="/">[Recent]</Link>
          <Link to="/leaderboard" className='active'>[Price]</Link>
        </div>
        <hr />
        <div>
          {memes}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
  contracts: state.contracts,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeLeaderboard);
