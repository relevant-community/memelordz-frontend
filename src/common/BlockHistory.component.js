import React, { Component } from 'react';
import { drizzle } from '../eth/drizzle.config';
import { toNumber, ChanDate } from '../util';
import PriceChart from './PriceChart.component';

class BlockHistory extends Component {
  state = {
    timestamps: {},
    sort: [],
  }

  handleBlockLoad(block, event) {
    if (block) {
      this.setState({
        timestamps: {
          ...this.state.timestamps,
          [event.blockHash]: parseInt(block.timestamp, 10),
        }
      });
    }
  }

  render() {
    const { contract, symbol, showChart, currentPrice } = this.props;
    const { timestamps } = this.state;

    const sortedEvents = contract.events
      .map(event => [event, timestamps[event.blockHash] || Infinity])
      .sort((a, b) => a[1] - b[1]);

    return (
      <div className='blockHistory'>
        {showChart && <PriceChart events={sortedEvents} symbol={symbol} currentPrice={currentPrice} />}
        <div className='pagelist'>
          {sortedEvents.map(([event]) => (
            <BlockHash
              key={event.blockHash}
              onBlockLoad={this.handleBlockLoad.bind(this)}
              event={event}
              symbol={symbol}
            />
          ))}
        </div>
      </div>
    );
  }
}

class BlockHash extends Component {
  state = {
    block: {},
  }

  componentDidMount() {
    const { event } = this.props;
    // console.log(event);
    if (event) {
      drizzle.web3.eth.getBlock(event.blockHash).then(block => {
        if (this.props.onBlockLoad) {
          this.props.onBlockLoad(block, event);
        }
        this.setState({ block });
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.event !== nextProps.event) return true;
    if (this.props.symbol !== nextProps.symbol) return true;
    if (this.state.block !== nextState.block) return true;
    return false;
  }

  render() {
    if (this.props.timestamp) {
      return (
        <span className='timestamp'>
          {this.state.block.timestamp ? ChanDate(this.state.block.timestamp * 1000) : 'Loading'}
        </span>
      );
    }

    let message;
    switch (this.props.event.event) {
      case 'StoreHash': {
        message = <i>block created</i>;
        break;
      }

      case 'Minted': {
        const { amount, totalCost } = this.props.event.returnValues;
        message = (
          <span>
            <span className='subject'>
              {toNumber(amount, 18).toFixed(2)}
              {' '}
              {this.props.symbol}
            </span>
            {' '}
            <i>
              {'spent '}
              {toNumber(totalCost, 18).toFixed(2)}
              {' ETH'}
            </i>
          </span>
        );
        break;
      }

      case 'Burned': {
        const { amount, reward } = this.props.event.returnValues;
        message = (
          <span>
            <span className='subject'>
              {toNumber(amount, 18).toFixed(2)}
              {' '}
              {this.props.symbol}
            </span>
            {' '}
            <i>
              {'rewarded '}
              {toNumber(reward, 18).toFixed(2)}
              {' ETH'}
            </i>
          </span>
        );
        break;
      }

      default: {
        console.log(this.props.event);
        message = <i>unknown event?</i>;
        break;
      }
    }

    return (
      <div className='row'>
        <Hash hash={this.props.event.blockHash} />
        <span className='gray timestamp'>{this.state.block.timestamp ? ChanDate(this.state.block.timestamp * 1000) : 'Loading'}</span>
        <span className='subject'>{this.props.event.event}</span>
        <span>{message}</span>
      </div>
    );
  }
}

class Hash extends Component {
  state = {
    open: false,
  }

  render() {
    return (
      <span
        onClick={() => this.setState({ open: !this.state.open })}
        className={this.state.open ? 'open hash' : 'hash'}
      >
        {this.props.hash.substr(2, this.state.open ? 66 : 6 )}
      </span>
    );
  }
}

export { BlockHistory, BlockHash, Hash };
