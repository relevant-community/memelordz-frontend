import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav, Pagination, ThemeSelect } from '../common';
import { toNumber, calculateSaleReturn } from '../util';

const defaultPage = {
  board: 'memes',
  top: false,
  page: 0,
};

const catalogPerPage = 50;
const indexPerPage = 5;

class MemeIndex extends Component {
  state = {
    page: 0,
    perPage: 5,
    board: 'memes',
    sort: false,
    catalog: false,
    memes: [],
  }

  static getDerivedStateFromProps(props, state) {
    let { board, sort, page } = props.match ? props.match.params : defaultPage;
    let { perPage } = state;
    let catalog = false;
    if (page === 'catalog') {
      catalog = true;
      page = 0;
    } else if (sort && !page && parseInt(sort)) {
      page = sort;
      sort = false;
    } else if (page && !parseInt(page)) {
      sort = page;
      page = 0;
    }

    perPage = catalog ? catalogPerPage : indexPerPage;

    page = parseInt(page, 10) || 0;
    if (page) {
      page -= 1;
    }

    return {
      ...state,
      board,
      sort,
      page,
      catalog,
      perPage,
      memes: props.memes.length ? props.memes : state.memes,
    };
  }

  shouldComponentUpdate() {
    const now = Date.now();
    if (now - (this.lastUpdate || 0) < 200) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
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

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  queryParams(prevProps = {}, prevState = {}) {
    const { memes, contracts } = this.props;
    if (this.state.memes === prevState.memes
      && this.state.sort === prevState.sort
      && this.state.board === prevState.board) {
      return;
    }
    if (this.state.sort === 'sort') {
      memes.forEach(address => {
        let contract = contracts[address];
        if (!contract || !contract.methods) return;
        if (contract.methods.totalSupply.fromCache() === undefined) {
          contract.methods.totalSupply.cacheCall();
        }
      });
    }
    if (this.state.board === 'portfolio') {
      let account = this.props.accounts[0];
      if (!account) return;
      memes.forEach(address => {
        let contract = contracts[address];
        if (!contract || !contract.methods) return;
        if (contract.methods.balanceOf.fromCache(account) === undefined) {
          contract.methods.balanceOf.cacheCall(account);
        }
      });
    }
    if (this.state.sort === 'hodl') {
      memes.forEach(address => {
        const contract = contracts[address];
        if (!contract || !contract.methods) return;
        if (contract.methods.poolBalance.fromCache() === undefined) {
          contract.methods.poolBalance.cacheCall();
        }
        if (contract.methods.totalSupply.fromCache() === undefined) {
          contract.methods.totalSupply.cacheCall();
        }
        if (contract.methods.slope.fromCache() === undefined) {
          contract.methods.slope.cacheCall();
        }
        if (contract.methods.exponent.fromCache() === undefined) {
          contract.methods.exponent.cacheCall();
        }
      });
    }
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    let { board, sort, page, perPage, catalog } = this.state;
    let { memes, accounts, contracts } = this.props;
    let account = accounts[0];
    const loading = !memes.length;

    if (board === 'portfolio') {
      if (!account) return (
        <div>No account found!<br/>Please re-open MetaMask and make sure you're signed in.</div>
      );
      memes = memes.filter(address => {
        const contract = contracts[address];
        if (!contract || !contract.methods) return null;
        const balance = toNumber(contract.methods.balanceOf.fromCache(account), 18);
        if (!balance) return null;
        return address;
      });
    }

    if (sort === 'top') {
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
    } else if (sort === 'hodl') {
      memes = memes.map(address => {
        const contract = contracts[address];
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
      <Meme key={address} address={address} catalog={catalog} />
    ));

    return (
      <div>
        <hr />
        <Create />
        <hr />
        <Nav board={board} catalog={catalog} />
        <hr />
        {board === 'portfolio' && <h2>Your Portfolio</h2>}
        <div className={catalog ? 'catalog' : 'memes'}>
          {loading
            ? <div className='loadingMessage'>
                Loading memes...
              </div>
            : memes
          }
        </div>
        <div className="bottom_nav">
          <Pagination
            board={sort ? board + '/' + sort : board}
            page={page + 1}
            total={total}
            perPage={perPage}
            loading={loading}
            catalog={catalog}
          />
          <ThemeSelect />
        </div>
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
