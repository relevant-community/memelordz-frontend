import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <br /><br />
      <br /><br />
      <small>
        {'All trademarks and copyrights on this page are owned by their respective parties. Images uploaded are the responsibility of the Poster.'}
        <br />
        <a href="https://twitter.com/memelordzapp">Twitter</a>
        {' • '}
        <a href="https://t.me/meme_lordz">Telegram</a>
        {' • '}
        <a href="https://www.instagram.com/memelordzapp/">Insta</a>
      </small>
    </footer>
  );
}

export default Footer;
