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
      return [
        contract.methods.totalSupply.fromCache() || 0,
        address
      ];
    }).filter(a => !!a).sort((a, b) => b[0] - a[0]);
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

    let memes = this.state.sorted.map(pair => {
      let address = pair[1];
      return <Meme key={address} address={address} />;
    });

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
