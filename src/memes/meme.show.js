import React, { Component } from 'react';
import { connect } from 'react-redux';
import Meme from './meme.component';

class MemeShow extends Component {
  render() {
    if (!this.props.ProxyFactory.events || this.props.ProxyFactory.events.length === 0) {
      return (
        <div className="loadingMessage">
          <hr />
          Loading meme...
        </div>
      );
    }
    const { address } = this.props.match.params;
    return (
      <div>
        <hr />
        <Meme address={address} showChart />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
  Controller: state.contracts.Controller || {}
});

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemeShow);
