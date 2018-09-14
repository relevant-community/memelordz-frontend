import React from 'react';
import { Link } from 'react-router-dom';

export default function CornerLinks() {
  return (
    <div className='pagelist'>
      <div className='pages'>
        <Link to="/">Index</Link>
      </div>
      <div className='cataloglink'>
        <Link to="/memes/catalog/">Catalog</Link>
      </div>
      <div className='cataloglink'>
        <Link to="/portfolio/">Portfolio</Link>
      </div>
    </div>
  );
};
