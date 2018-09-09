import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

function Nav(props) {
  return (
    <div className='nav'>
      Sort memes by:
      <ActiveLink to="/">[Recent]</ActiveLink>
      <ActiveLink to="/leaderboard">[Price]</ActiveLink>
      <ActiveLink to="/portfolio">[View Your Portfolio]</ActiveLink>
    </div>
  );
}

const ActiveLink = withRouter(({ to, location, children }) => (
  <Link to={to} className={location.pathname === to ? 'active' : ''}>
    {children}
  </Link>
));

export default Nav;
