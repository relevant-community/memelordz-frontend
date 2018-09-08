import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Eth from './eth.context';
import { Drizzle } from 'drizzle';

class EthProvider extends Component {
  static contextTypes = {
    store: PropTypes.object,
    drizzle: PropTypes.object
  }

  static contextTypes = {
    store: PropTypes.object,
    drizzle: PropTypes.object,
  }

  initialState = {
    balance: 0,
    account: null,
    network: null,
    status: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
  }

  componentDidUpdate(lastProps) {
    console.log('updated');
    drizzle = this.context.drizzle;
    if (!lastProps.status && this.props.status) {
      const contractConfig = {
        contractName: 'ProxyFactory',

        web3Contract: new drizzle.web3.eth.Contract(
          ProxyFactory.abi,
          PROXY_FACTORY,
          // {
          //   from: store.getState().accounts[0],
          //   data: contractArtifact.deployedBytecode
          // }
        )
      };
      let events = ['ProxyDeployed'];
      drizzle.addContract(contractConfig, events);
    }

    console.log('dirzzle', this.context.drizzle);
  }

  render() {
    return (
      <Eth.Provider value={this.state}>
        {this.props.children}
      </Eth.Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.accounts[0],
  ProxyFactory: state.contracts.ProxyFactory,
  network: state.web3.networkId,
  status: state.web3.status
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EthProvider);
