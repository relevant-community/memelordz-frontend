import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav, Pagination } from '../common';
import { toNumber, calculateSaleReturn } from '../util';

const defaultPage = {
  board: 'meme',
  top: false,
  page: 0,
};

class MemeIndex extends Component {
  state = {
    page: 0,
    perPage: 5,
    board: 'meme',
    top: false,
  }

  static getDerivedStateFromProps(props, state) {
    let { board, top, page } = props.match ? props.match.params : defaultPage;
    if (top && !page && parseInt(top)) {
      page = top;
      top = false;
    } else if (page && !parseInt(page)) {
      top = page;
      page = 0;
    }

    page = parseInt(page, 10) || 0;
    if (page) {
      page -= 1;
    }

    return {
      ...state,
      board,
      top,
      page,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const now = Date.now();
    if (now - (this.lastUpdate || 0) < 200) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('force update');
        this.forceUpdate();
      }, 500);
      return false;
    }
    this.lastUpdate = now;
    return true;
  }

  componentDidMount() {
    this.queryParams();
  }

  componentDidUpdate(prevProps, prevState) {
    this.queryParams(prevProps, prevState);
  }

  queryParams(prevProps = {}, prevState = {}) {
    const { memes, contracts } = this.props;
    if (this.props.memes === prevProps.memes
      && this.state.top === prevState.top
      && this.state.board === prevState.board) {
      return;
    }
    if (this.state.top === 'top') {
      memes.forEach(address => {
        let contract = contracts[address];
        if (contract && contract.methods && contract.methods.totalSupply.fromCache() === undefined) {
          // console.log(contract.methods.totalSupply.fromCache());
          contract.methods.totalSupply.cacheCall();
        }
      });
    }
    if (this.state.board === 'portfolio') {
      let account = this.props.accounts[0];
      if (!account) return;
      memes.forEach(address => {
        let contract = contracts[address];
        if (contract && contract.methods && contract.methods.balanceOf.fromCache(account) === undefined) {
          contract.methods.balanceOf.cacheCall(account);
        }
      });
    }
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    let { board, top, page, perPage } = this.state;
    let { memes, accounts, contracts } = this.props;
    let account = accounts[0];
    const loading = !memes.length;

    if (board === 'portfolio') {
      if (!account) return ( <div>No account found!<br/>Please re-open MetaMask and make sure you're signed in.</div>);
      memes = memes.filter(address => {
        const contract = contracts[address];
        if (!contract || !contract.methods) return null;
        const balance = toNumber(contract.methods.balanceOf.fromCache(account), 18);
        if (!balance) return null;
        return address;
      });
    }

    if (top === 'top') {
      memes = memes.map(address => {
        const contract = contracts[address];
        if (!contract || !contract.methods) return null;
        return [
          contract.methods.totalSupply.fromCache() || 0,
          address
        ];
      }).filter(pair => pair)
        .sort((a, b) => b[0] - a[0])
        .map(pair => pair[1]);
    } else if (top === 'hodl') {
      memes = memes.map(address => {
        const  contract = contracts[address];
        if (!contract || !contract.methods) return null;
        const tokens = toNumber(contract.methods.balanceOf.fromCache(account), 18);
        const saleReturn = calculateSaleReturn({
          poolBalance: toNumber(contract.methods.poolBalance.fromCache(), 18),
          totalSupply: toNumber(contract.methods.totalSupply.fromCache(), 18),
          slope: toNumber(contract.methods.slope.fromCache(), 0),
          exponent: toNumber(contract.methods.exponent.fromCache(), 0),
          amount: tokens,
        });
        return [
          saleReturn || 0,
          address
        ];
      }).filter(pair => pair)
        .sort((a, b) => b[0] - a[0])
        .map(pair => pair[1]);
    }


    const firstMeme = page * perPage;
    const lastMeme = (page + 1) * perPage;
    const total = memes.length;
    memes = memes.slice(firstMeme, lastMeme).map(address => (
      <Meme key={address} address={address} />
    ));

    return (
      <div>
        <hr />
        <Create />
        <hr />
        <Nav board={board} />
        <hr />
          {board === 'portfolio' && <h2>Your Portfolio</h2>}
          {loading
            ? <div className='loadingMessage'>
                Loading memes...
              </div>
            : memes
          }
        <Pagination
          board={top ? board + '/' + top : board}
          page={page + 1}
          total={total}
          perPage={perPage}
          loading={loading}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contracts: state.contracts,
  accounts: state.accounts,
  memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeIndex);
