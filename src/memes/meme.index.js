import React, { Component } from 'react';
import { connect } from 'react-redux';
import Meme from './meme.component';

class MemeIndex extends Component {
  render() {
    if (!this.props.ProxyFactory.events) return null;

    let { events } = this.props.ProxyFactory;
    let memes = events.map(meme => {
      if (!meme) return null;
      let address = meme.returnValues.proxyAddress;
      return <Meme key={address} address={address} />;
    });

    return (
      <div>
        {memes.reverse()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeIndex);
