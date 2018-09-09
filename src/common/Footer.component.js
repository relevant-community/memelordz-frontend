import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <hr />
      <br /><br />
      This is a beta MVP built for ETHBerlin 2018.<br />
      <a href='https://t.me/meme_lordz'>Follow us on Telegram for updates</a>
      <br /><br />
      <small>Copyright © 2018 "The Meme Lordz" dank meme support group. All rights reserved.</small>
    </footer>
  );
}

export default Footer;
