import React from 'react';
import PropTypes from 'prop-types';

import ActiveLink from './ActiveLink.component';

function Nav({ board = 'memes' }) {
  if (board === 'portfolio') {
    return (
      <div className='nav'>
        <ActiveLink to="/">Browse Memes</ActiveLink>
        {'Sort by: '}
        <ActiveLink to={'/' + board + '/'}>Recent</ActiveLink>
        <ActiveLink to={'/' + board + '/top/'}>Price</ActiveLink>
        <ActiveLink to={'/' + board + '/hodl/'}>Your Holdings</ActiveLink>
      </div>
    );
  }
  return (
    <div className='nav'>
      <ActiveLink to="/portfolio/">View Your Portfolio</ActiveLink>
      {'Sort by: '}
      <ActiveLink to={'/' + board + '/'}>Recent</ActiveLink>
      <ActiveLink to={'/' + board + '/top/'}>Price</ActiveLink>
    </div>
  );
}

Nav.propTypes = {
  board: PropTypes.string,
};

export default Nav;
