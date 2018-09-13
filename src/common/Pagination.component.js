import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActiveLink from './ActiveLink.component';

const pageUrl = (board, index, catalog) => '/' + board + '/' + (index < 2 ? '' : index + '/') + (catalog ? 'catalog/' : '');

function Pagination({ board, page, total, perPage, loading, catalog }) {
  if (loading) {
    return (
      <div className='pagelist'>
        <div className='pages'>Loading</div>
      </div>
    );
  }
  const pages = [];
  const count = Math.ceil(total / perPage);
  const closestTen = 10 * Math.floor((page - 1) / 10);
  const countToTen = Math.min(count, closestTen + 10);
  let index = closestTen + 1;
  do {
    pages.push(
      <ActiveLink isActive={index === page} key={index} to={pageUrl(board, index, catalog)}>{index}</ActiveLink>
    );
  } while (index++ < countToTen);

  return (
    <div className='pagelist'>
      {page > 1
        && <Link className='btn' to={pageUrl(board, page - 1, catalog)}><button>Previous</button></Link>}
      {page === 1
        && <Link className='alllink' to={'/' + board + '/'}>All</Link>}
      <div className='pages'>
        {pages}
      </div>
      {page < count
        && count > 0
        && <Link className='btn' to={pageUrl(board, page + 1)}><button>Next</button></Link>}
      {catalog
        ? <ActiveLink className='cataloglink' to={'/' + board + '/'} braces={false}>Index</ActiveLink>
        : <ActiveLink className='cataloglink' to={'/' + board + '/catalog/'} braces={false}>Catalog</ActiveLink>
      }
    </div>
  );
}

Pagination.propTypes = {
  board: PropTypes.string,
  total: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  loading: PropTypes.bool,
  catalog: PropTypes.bool,
};

Pagination.defaultProps = {
  board: 'memes',
  items: [],
  page: 0,
  perPage: 5,
  loading: true,
  catalog: false,
};

export default Pagination;
