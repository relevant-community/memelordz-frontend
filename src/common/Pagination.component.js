import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActiveLink from './ActiveLink.component';

const pageUrl = (board, index) => '/' + board + '/' + (index < 2 ? '' : index + '/');

function Pagination({ board, page, items, perPage }) {
  const pages = [];
  const count = Math.ceil(items.length / perPage);
  const countToTen = Math.min(count, 10);
  let index = 1;
  do {
    pages.push(<ActiveLink isActive={index === page} key={index} to={pageUrl(board, index)}>{index}</ActiveLink>);
  } while (index++ < countToTen);

  return (
    <div className='pagelist'>
      {page > 1
        && <Link to={pageUrl(board, page - 1)}><button>Previous</button></Link>}
      <ActiveLink to={'/' + board + '/'}>All</ActiveLink>
      <div className='pages'>
        {pages}
      </div>
      {page < count
        && count > 0
        && <Link to={pageUrl(board, page + 1)}><button>Next</button></Link>}
      <ActiveLink className='cataloglink' to={'/' + board + '/catalog/'} braces={false}>Catalog</ActiveLink>
    </div>
  );
}

Pagination.propTypes = {
  board: PropTypes.string,
  items: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
};

Pagination.defaultProps = {
  board: 'all',
  items: [],
  page: 0,
  perPage: 5,
};

export default Pagination;
