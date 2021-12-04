import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
  toNumber,
  toFixed,
  calculatePurchaseReturn,
  calculateSaleReturn
} from '../util';
import './trade.css';

const { BN } = Web3.utils;

class Trade extends Component {
  state = {
    active: false,
    loading: false,
    isBuy: true,
    amount: ''
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleBuy = this.toggleBuy.bind(this);
  }

  componentDidMount() {
    this.queryParams();
  }

  queryParams() {
    let { contract, accounts } = this.props;
    contract.methods.name.cacheCall();
    contract.methods.symbol.cacheCall();
    contract.methods.poolBalance.cacheCall();
    contract.methods.totalSupply.cacheCall();
    contract.methods.decimals.cacheCall();
    contract.methods.exponent.cacheCall();
    contract.methods.slope.cacheCall();
    if (accounts[0]) {
      contract.methods.balanceOf.cacheCall(accounts[0]);
    }
  }

  toggleBuy(isBuy) {
    this.setState({
      amount: '',
      isBuy
    });
  }

  activate() {
    this.setState({ active: true });
  }

  // submit() {
  //   let amount = Web3.utils.toWei(this.state.amount.toString());
  //   amount = new BN(amount.toString());
  //   this.props.contract.methods.buy.cacheSend({
  //     value: amount,
  //     from: account,
  //   });
  // }

  static getDerivedStateFromProps(props, state) {
    let { contract, accounts, accountBalances } = props;

    let decimals = contract.methods.decimals.fromCache();
    let totalSupply = toNumber(
      contract.methods.totalSupply.fromCache(),
      decimals
    );
    let poolBalance = toNumber(
      contract.methods.poolBalance.fromCache(),
      decimals
    );
    let exponent = toNumber(contract.methods.exponent.fromCache(), 0);
    let slope = toNumber(contract.methods.slope.fromCache(), 0);
    let symbol = contract.methods.symbol.fromCache();

    let account = accounts[0];
    let walletBalance = toNumber(accountBalances[account], 18);
    let tokenBalance = 0;
    if (account) {
      tokenBalance = toNumber(
        contract.methods.balanceOf.fromCache(account) || 0,
        decimals
      );
    }

    return {
      loading: state.loading,
      account,
      decimals,
      totalSupply,
      poolBalance,
      walletBalance,
      exponent,
      slope,
      tokenBalance,
      symbol: (symbol || 'MEME').toUpperCase()
    };
  }

  onInput(e) {
    let value = parseFloat(e.target.value);
    if (value > parseFloat(e.target.max)) value = e.target.max;
    else if (!value || value < 0) value = '';
    this.setState({ amount: value });
  }

  async handleSubmit() {
    if (this.state.loading) return;
    try {
      let { account, decimals, amount, walletBalance } = this.state;
      let { contract } = this.props;

      if (!account) {
        window.alert('Missing account — please log into Metamask');
      }
      this.setState({ loading: true });

      if (this.state.isBuy) {
        let numOfTokens = calculatePurchaseReturn(this.state);
        numOfTokens = (numOfTokens * 1e18).toString();
        amount *= 1.0000001;
        amount = Web3.utils.toWei(amount.toString());
        amount = new BN(amount.toString());
        // let balanceInWei = Web3.utils.toWei(walletBalance.toString());
        // if (amount.gt(balanceInWei)) {
        //   console.log('amount is greater than balance');
        //   this.setState({ amount: walletBalance });
        //   amount = Web3.utils.toWei(walletBalance.toString());
        //   numOfTokens = calculatePurchaseReturn(this.state);
        //   numOfTokens = (numOfTokens * 1e18).toString();
        //   console.log(amount.toString());
        // }
        contract.methods.mint.cacheSend(numOfTokens, {
          value: amount,
          from: account
        });
      } else {
        amount = Web3.utils.toWei(amount.toString());
        contract.methods.burn.cacheSend(amount.toString(), {
          from: account
        });
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ active: false });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 10000);
    // console.log(">> execute the trade")
  }

  render() {
    if (!this.state.active) {
      return (
        <div className="tradeContainer inactive">
          <div className="row">
            <div className="row toggleBuy" onClick={this.activate.bind(this)}>
              <div onClick={() => this.toggleBuy(true)}>Buy</div>
              <div onClick={() => this.toggleBuy(false)}>Sell</div>
            </div>
          </div>
          {this.state.loading && this.renderLoader()}
        </div>
      );
    }
    let { amount, walletBalance, tokenBalance, isBuy, symbol } = this.state;

    let action;
    let actionLabel;
    let available;
    let otherTokenValue;
    let thisTokenSymbol;
    let otherTokenSymbol;

    if (isBuy) {
      actionLabel = 'Pay With';
      action = 'Buy';
      available = (
        <a onClick={() => this.setState({ amount: walletBalance })}>
          {(walletBalance || 0).toFixed(2)} ETH
        </a>
      );
      otherTokenValue = (calculatePurchaseReturn(this.state) || 0).toFixed(2);
      thisTokenSymbol = ' ETH';
      otherTokenSymbol = ' ' + symbol;
    } else {
      action = 'Sell';
      actionLabel = 'Sell';
      available = (
        <a onClick={() => this.setState({ amount: tokenBalance })}>
          {(tokenBalance || 0).toFixed(2)} {symbol}
        </a>
      );
      otherTokenValue = (calculateSaleReturn(this.state) || 0).toFixed(2);
      thisTokenSymbol = ' ' + symbol;
      otherTokenSymbol = ' ETH';
    }

    if (isNaN(otherTokenValue)) {
      otherTokenValue = '(computing)';
    }

    return (
      <div className="tradeContainer">
        <div className="row">
          <div className="row toggleBuy">
            <div
              onClick={() => this.toggleBuy(true)}
              className={isBuy ? 'active' : ''}
            >
              Buy
            </div>
            <div
              onClick={() => this.toggleBuy(false)}
              className={!isBuy ? 'active' : ''}
            >
              Sell
            </div>
          </div>
        </div>

        <div className="tradeSection">
          <div>
            <label>
              {actionLabel}
              {': '}
            </label>

            <input
              onFocus={(e) => {
                if (e.target.value === '0') this.setState({ amount: '' });
              }}
              type="number"
              autoFocus
              min={0}
              max={isBuy ? toFixed(walletBalance, 4) : toFixed(tokenBalance, 4)}
              step={0.0001}
              autoComplete="off"
              value={amount}
              onInput={this.onInput.bind(this)}
              onChange={this.onInput.bind(this)}
            />
            {thisTokenSymbol}
          </div>

          <div>
            <label>Receive:</label>
            {otherTokenValue} {otherTokenSymbol}
          </div>

          <div>
            <label />
            <button onClick={this.handleSubmit.bind(this)}>{action}</button>
          </div>

          <div className={'bondedToken-available'}>
            <label>Available:</label>
            {available}
          </div>
        </div>
        {this.state.loading && this.renderLoader()}
      </div>
    );
  }

  renderLoader() {
    return (
      <div className={'modal loader visible'}>
        <div className="inner">
          <div className="content">Confirming transaction...</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    drizzleStatus: state.drizzleStatus,
    accounts: state.accounts,
    accountBalances: state.accountBalances
    // drizzle: {
    // transactions: state.transactions,
    // web3: state.web3,
    // transactionStack: state.transactionStack,
    // }
  };
}

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
