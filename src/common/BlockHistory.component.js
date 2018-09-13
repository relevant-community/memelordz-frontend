import React, { Component } from 'react';
import { drizzle } from '../eth/drizzle.config';
import { ChanDate } from '../util';

class BlockHistory extends Component {
  render() {
    return (
      <div className='blockHistory'>
        {this.props.contract.events.map(event => <BlockHash key={event.blockHash} event={event} />)}
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
    console.log(event);
    if (event) {
      drizzle.web3.eth.getBlock(event.blockHash).then(block => {
        this.setState({ block });
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.event !== nextProps.event) return true;
    if (this.state.block !== nextState.block) return true;
    return false;
  }

  render() {
    if (this.props.timestamp) {
      return this.state.block.timestamp ? ChanDate(this.state.block.timestamp * 1000) : 'Loading';
    }
    let message;
    switch (this.props.event.event) {
      case 'StoreHash':
        message = <i>block created</i>;
        break;
      case 'Minted':
        message = <i>bought</i>;
        break;
      case 'Burned':
        message = <i>sold</i>;
        break;
      default:
        message = <i>unknown event?</i>;
        break;
    }
    return (
      <div className='row'>
        <Hash hash={this.props.event.blockHash} />
        <span className='subject'>{this.props.event.event}</span>
        {message}
        {this.state.block.timestamp ? ChanDate(this.state.block.timestamp * 1000) : 'Loading'}
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
        {this.props.hash.substr(2)}
      </span>
    );
  }
}

export { BlockHistory, BlockHash, Hash };
