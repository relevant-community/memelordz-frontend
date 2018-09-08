import React, { Component } from 'react';
import { connect } from 'react-redux';
import Meme from './meme.component';
import Create from '../create/create.component';

class MemeIndex extends Component {
  state = {
    sort: 'recent',
  }

  render() {
    if (!this.props.ProxyFactory.events || this.props.ProxyFactory.events.length === 0) {
      return (
        <div>
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

    if (this.state.sort === 'recent') {
      memes.reverse();
    }

    return (
      <div>
        <hr />
          <Create />
        <hr />
        <div className='sortLinks'>
          Sort memes by:
          {this.sortLink('recent', 'Recent')}
          {this.sortLink('price', 'Price')}
        </div>
        <hr />
        <div>
          {memes}
        </div>
      </div>
    );
  }

  sortLink(key, label) {
    const className = (key === this.state.sort) ? 'active' : '';
    return (
      <u className={className} onClick={() => this.setState({ sort: key })}>
        {'[' + label + ']'}
      </u>
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
