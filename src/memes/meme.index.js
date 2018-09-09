import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav } from '../common';

class MemeIndex extends Component {
  state = {
    page: 0,
    perPage: 5
  }
  constructor(props) {
    super(props);
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
  }
  prev (e) {
    if (this.state.page > 0) {
      this.setState({page: this.state.page-1})
      window.scrollTo(0, 0)
    }
    e.stopPropagation()
    return false
  }
  next (e) {
    let totalLength = Math.ceil(this.props.memes.length / this.state.perPage)
    if (this.state.page < totalLength) {
      this.setState({page: this.state.page+1})
      window.scrollTo(0, 0)
    }
    e.stopPropagation()
    return false
  }
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
    
    let firstMeme = this.state.page * this.state.perPage
    let lastMeme = (this.state.page + 1) * this.state.perPage
    let memes = this.props.memes.slice(firstMeme, lastMeme).map(meme => {
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
        <a className="pagination" href="#" onClick={this.prev}>Prev</a>
        <a className="pagination" href="#" onClick={this.next}>Next</a>
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
