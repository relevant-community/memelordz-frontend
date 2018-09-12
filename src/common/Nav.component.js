import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

function Nav({ board = 'memes' }) {
  let lastLink;
  if (board === 'memes') {
    lastLink = <ActiveLink to="/portfolio/">[View Your Portfolio]</ActiveLink>
  } else {
    lastLink = <ActiveLink to="/">[Browse All Memes]</ActiveLink>
  }
  return (
    <div className='nav'>
      Sort memes by:
      <ActiveLink to={'/' + board + '/'}>[Recent]</ActiveLink>
      <ActiveLink to={'/' + board + '/top/'}>[Price]</ActiveLink>
      {lastLink}
    </div>
  );
}

const ActiveLink = withRouter(({ to, location, children }) => (
  <Link to={to} className={location.pathname === to ? 'active' : ''}>
    {children}
  </Link>
));

export default Nav;
