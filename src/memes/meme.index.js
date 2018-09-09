import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav } from '../common';

class MemeIndex extends Component {
  render() {
    if (!this.props.ProxyFactory.events || this.props.ProxyFactory.events.length === 0) {
      return (
        <div>
          <hr />
          <Create />
          <hr />
          <div className="loadingMessage">Loading memes...</div>
        </div>
      );
    }

    let { events } = this.props.ProxyFactory;
    let memes = events.map(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      return <Meme key={address} address={address} />;
    });

    memes.reverse();

    return (
      <div>
        <hr />
        <Create />
        <hr />
        <Nav />
        <hr />
        <div>{memes}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ProxyFactory: state.contracts.ProxyFactory || {}
});

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemeIndex);
