import React from 'react';
import { Link, withRouter } from 'react-router-dom';

export default withRouter(({
  to,
  location,
  className = 'navlink',
  isActive = false,
  braces = true,
  children,
}) => (
  <span className={className}>
    {braces && '['}
    <Link to={to} className={(isActive || location.pathname === to) ? 'active' : ''}>
      {children}
    </Link>
    {braces && '] '}
  </span>
));
