import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav } from '../common';

class MemeIndex extends Component {
  render() {
    if (!this.props.memes.length) {
      return (
        <div>
          <hr />
            <Create />
          <div className='loadingMessage'>
            Loading memes...
          </div>
        </div>
      );
    }

    let memes = this.props.memes.map(meme => {
      if (!meme) return null;
      return <Meme key={meme} address={meme} />;
    });

    return (
      <div>
        <hr />
          <Create />
        <hr />
          <Nav />
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
  memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeIndex);
