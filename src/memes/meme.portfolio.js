import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { toNumber } from '../util';

class MemeLeaderboard extends Component {
  state = {
    sorted: [],
  }

  componentDidMount() {
    this.queryParams();
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts[0] !== prevProps.accounts[0] ||
      this.props.ProxyFactory.events.length !== prevProps.ProxyFactory.events.length) {
      setTimeout(() => this.queryParams(), 1000);
    }
  }

  queryParams() {
    let account = this.props.accounts[0];
    if (!account) return;
    this.props.ProxyFactory.events.forEach(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      let contract = this.props.contracts[address];
      if (!contract || !contract.methods) return;
      contract.methods.balanceOf.cacheCall(account);
    });
  }

  static getDerivedStateFromProps(props, state) {
    let { events } = props.ProxyFactory;

    let account = props.accounts[0];
    if (!account) return;

    let sorted = events.map(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      let contract = props.contracts[address];
      if (!contract || !contract.methods) return null;
      let balance = toNumber(contract.methods.balanceOf.fromCache(account), 18);
      if (!balance) return null;
      return address;
    }).filter(address => address);
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
    let memes = this.state.sorted.map(address => {
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
          <Link to="/leaderboard">[Price]</Link>
          <Link to="/portfolio" className='active'>[Portfolio]</Link>
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
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeLeaderboard);
