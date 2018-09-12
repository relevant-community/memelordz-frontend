import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav } from '../common';
import { toNumber } from '../util';

class MemeLeaderboard extends Component {
  state = {
    sorted: [],
    page: 0,
    perPage: 5
  }
  constructor(props) {
    super(props);
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
  }
  prev () {
    if (this.state.page > 0) {
      this.setState({page: this.state.page-1})
      window.scrollTo(0, 0)
    }
    return false
  }
  next () {
    let totalLength = Math.ceil(this.props.memes.length / this.state.perPage)
    if (this.state.page < totalLength) {
      this.setState({page: this.state.page+1})
      window.scrollTo(0, 0)
    }
    return false
  }
  componentDidMount() {
    window.scrollTo(0, 0)
    this.queryParams();
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts[0] !== prevProps.accounts[0] ||
      this.props.memes.length !== prevProps.memes.length) {
      setTimeout(() => this.queryParams(), 1000);
    }
  }

  queryParams() {
    let account = this.props.accounts[0];
    if (!account) return;
    this.props.memes.forEach(address => {
      if (!address) return null;
      let contract = this.props.contracts[address];
      if (!contract || !contract.methods) return;
      contract.methods.balanceOf.cacheCall(account);
    });
  }

  static getDerivedStateFromProps(props, state) {
    let account = props.accounts[0];
    if (!account) return state;

    let sorted = props.memes.map(address => {
      if (!address) return null;
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
    if (!this.props.memes.length) {
      return (
        <div>
          <hr />
          <div className='loadingMessage'>
            Loading memes...
          </div>
        </div>
      );
    }
    let firstMeme = this.state.page * this.state.perPage;
    let lastMeme = (this.state.page + 1) * this.state.perPage;
    let memes = this.state.sorted.slice(firstMeme, lastMeme).map(address => (
      <Meme key={address} address={address} />
    ));

    return (
      <div>
        <hr />
          <Create />
        <hr />
          <Nav />
        <hr />
        <div>
          {memes}
        </div>
        <a className="pagination" href="#/portfolio" onClick={this.prev}>Prev</a>
        <a className="pagination" href="#/portfolio" onClick={this.next}>Next</a>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
  contracts: state.contracts,
  accounts: state.accounts,
  memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeLeaderboard);
