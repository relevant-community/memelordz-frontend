import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav, Pagination } from '../common';

class MemeIndex extends Component {
  state = {
    page: 0,
    perPage: 5,
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    // if (!this.props.memes.length) {
    //   return (
    //     <div>
    //       <hr />
    //         <Create />
    //       <div className='loadingMessage'>
    //         Loading memes...
    //       </div>
    //     </div>
    //   );
    // }

    let firstMeme = this.state.page * this.state.perPage;
    let lastMeme = (this.state.page + 1) * this.state.perPage;
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
        <Pagination
          board="m"
          page={this.state.page + 1}
          items={this.props.memes}
          perPage={this.state.perPage}
        />
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
