import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav, Pagination } from '../common';

const defaultPage = {
  category: 'meme',
  page: 0,
};

class MemeIndex extends Component {
  state = {
    page: 0,
    perPage: 5,
    memes: [],
  }

  static propTypes = {
    memes: PropTypes.array,
  }

  componentDidMount() {
    console.log('did mount');
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(this.props)
    let { category, page } = props.match ? props.match.params : defaultPage;
    page = parseInt(page, 10) || 0;
    if (page) {
      page -= 1;
    }
    const firstMeme = page * state.perPage;
    const lastMeme = (page + 1) * state.perPage;
    let memes = props.memes.slice(firstMeme, lastMeme);
    return {
      ...state,
      category,
      page,
      memes,
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    let memes = this.state.memes.map(meme => {
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
          {memes
          || <div className='loadingMessage'>
               Loading memes...
             </div>
          }
        <Pagination
          board="memes"
          page={this.state.page + 1}
          items={this.props.memes}
          perPage={this.state.perPage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeIndex);
