import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { toNumber, toFixed, calculatePurchaseReturn, calculateSaleReturn } from '../util';
import './trade.css';

const { BN } = Web3.utils;

class Trade extends Component {
  state = {
    active: false,
    isBuy: true,
    amount: '',
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

  toggleBuy() {
    this.setState({
      amount: '',
      isBuy: !this.state.isBuy
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

  static getDerivedStateFromProps(props) {
    let { contract, accounts, accountBalances } = props;

    let decimals = contract.methods.decimals.fromCache();
    let totalSupply = toNumber(contract.methods.totalSupply.fromCache(), decimals);
    let poolBalance = toNumber(contract.methods.poolBalance.fromCache(), decimals);
    let exponent = toNumber(contract.methods.exponent.fromCache(), 0);
    let slope = toNumber(contract.methods.slope.fromCache(), 0);
    let symbol = contract.methods.symbol.fromCache();

    let account = accounts[0];
    let walletBalance = toNumber(accountBalances[account], 18);
    let tokenBalance = 0;
    if (account) {
      tokenBalance = toNumber(contract.methods.balanceOf.fromCache(account) || 0, decimals);
    }

    return {
      account,
      decimals,
      totalSupply,
      poolBalance,
      walletBalance,
      exponent,
      slope,
      tokenBalance,
      symbol: (symbol || 'MEME').toUpperCase(),
    };
  }

  onInput(e) {
    let value = parseFloat(e.target.value);
    if (value > parseFloat(e.target.max)) value = e.target.max;
    else if (!value || value < 0) value = '';
    this.setState({ amount: value });
  }

  async handleSubmit() {
    try {
      let { account, decimals, amount } = this.state;
      let { contract } = this.props;

      if (!account) {
        window.alert('Missing account — please log into Metamask');
      }

      if (this.state.isBuy) {
        let numOfTokens = calculatePurchaseReturn(this.state);
        numOfTokens = (numOfTokens * 1e18).toString();
        amount *= 1.1;
        amount = Web3.utils.toWei(amount.toString());
        amount = new BN(amount.toString());

        contract.methods.mint.cacheSend(numOfTokens, {
          value: amount, from: account
        });
      } else {
        amount = Web3.utils.toWei(amount.toString());
        console.log(amount.toString());
        contract.methods.burn.cacheSend(amount.toString(), {
          from: account
        });
      }
    } catch (err) {
      console.log(err);
    }

    // console.log(">> execute the trade")
  }

  render() {
    if (!this.state.active) {
      return (
        <div className="tradeContainer inactive">
          <div className="row">
            <div className="row toggleBuy" onClick={this.activate.bind(this)}>
              <div>Buy</div>
              <div>Sell</div>
            </div>
          </div>
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
          <div className="row toggleBuy" onClick={this.toggleBuy}>
            <div className={isBuy ? 'active' : ''}>Buy</div>
            <div className={!isBuy ? 'active' : ''}>Sell</div>
          </div>
        </div>

        <div className="tradeSection">
          <div>
            <label>
              {actionLabel}{': '}
            </label>

            <input
              onFocus={e => {
                if (e.target.value === '0') this.setState({ amount: '' });
              }}
              type="number"
              autoFocus
              min={0}
              max={isBuy ? toFixed(walletBalance, 4) : toFixed(tokenBalance, 4)}
              autoComplete="off"
              value={amount}
              onInput={this.onInput.bind(this)}
              onChange={this.onInput.bind(this)}
            />
            {thisTokenSymbol}
          </div>

          <div>
            <label>
              Receive:
            </label>
            {otherTokenValue} {otherTokenSymbol}
          </div>

          <div>
            <label></label>
            <button onClick={this.handleSubmit.bind(this)}>{action}</button>
          </div>

          <div className={'bondedToken-available'}>
            <label>Available:</label>
            {available}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    drizzleStatus: state.drizzleStatus,
    accounts: state.accounts,
    accountBalances: state.accountBalances,
    // drizzle: {
      // transactions: state.transactions,
      // web3: state.web3,
      // transactionStack: state.transactionStack,
    // }
  };
}


const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
