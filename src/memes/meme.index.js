import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';

class MemeIndex extends Component {
  render() {
    if (!this.props.ProxyFactory.events || this.props.ProxyFactory.events.length === 0) {
      return (
        <div>
          <hr />
            <Create />
          <hr />
          <div className='loadingMessage'>
            Loading memes...
          </div>
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
        <div className='sortLinks'>
          Sort memes by:
          <Link to="/" className='active'>[Recent]</Link>
          <Link to="/leaderboard">[Price]</Link>
          <Link to="/portfolio">[Portfolio]</Link>
        </div>
        <hr />
        <div>
          {memes}
        </div>
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
