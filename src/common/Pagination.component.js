import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActiveLink from './ActiveLink.component';

const pageUrl = (board, index) => '/' + board + '/' + (index < 2 ? '' : index + '/');

function Pagination({ board, page, total, perPage, loading }) {
  if (loading) {
    return null;
  }
  const pages = [];
  const count = Math.ceil(total / perPage);
  const closestTen = 10 * Math.floor((page - 1) / 10);
  const countToTen = Math.min(count, closestTen + 10);
  let index = closestTen + 1;
  do {
    pages.push(
      <ActiveLink isActive={index === page} key={index} to={pageUrl(board, index)}>{index}</ActiveLink>
    );
  } while (index++ < countToTen);

  return (
    <div className='pagelist'>
      {page > 1
        && <Link className='btn' to={pageUrl(board, page - 1)}><button>Previous</button></Link>}
      {page === 1
        && <Link to={'/' + board + '/'}>All</Link>}
      <div className='pages'>
        {pages}
      </div>
      {page < count
        && count > 0
        && <Link className='btn' to={pageUrl(board, page + 1)}><button>Next</button></Link>}
      <ActiveLink className='cataloglink' to={'/' + board + '/catalog/'} braces={false}>Catalog</ActiveLink>
    </div>
  );
}

Pagination.propTypes = {
  board: PropTypes.string,
  total: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  loading: PropTypes.bool,
};

Pagination.defaultProps = {
  board: 'memes',
  items: [],
  page: 0,
  perPage: 5,
  loading: true,
};

export default Pagination;
