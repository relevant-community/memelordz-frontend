import React from 'react';
import PropTypes from 'prop-types';

import ActiveLink from './ActiveLink.component';

function Nav({ board = 'memes', catalog = false }) {
  if (board === 'portfolio') {
    return (
      <div className='nav'>
        <ActiveLink to="/">Browse Memes</ActiveLink>
        {'Sort by: '}
        <ActiveLink to={'/' + board + '/hodl/' + (catalog ? 'catalog/' : '')}>Your Holdings</ActiveLink>
        <ActiveLink to={'/' + board + '/' + (catalog ? 'catalog/' : '')}>Recent</ActiveLink>
        <ActiveLink to={'/' + board + '/top/' + (catalog ? 'catalog/' : '')}>Price</ActiveLink>
      </div>
    );
  }
  return (
    <div className='nav'>
      <ActiveLink to="/portfolio/hodl/">View Your Portfolio</ActiveLink>
      {'Sort by: '}
      <ActiveLink to={'/' + board + '/' + (catalog ? 'catalog/' : '')}>Recent</ActiveLink>
      <ActiveLink to={'/' + board + '/top/' + (catalog ? 'catalog/' : '')}>Price</ActiveLink>
    </div>
  );
}

Nav.propTypes = {
  board: PropTypes.string,
  sort: PropTypes.string,
  catalog: PropTypes.bool,
};

export default Nav;
