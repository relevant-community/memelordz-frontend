import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './portfolio.css';

class Portfolio extends Component {
  render() {
    return (
      <div>
        <h2>Your Portfolio</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.accounts[0],
    accountBalances: state.accountBalances,
  };
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
