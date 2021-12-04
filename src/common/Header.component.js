import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Header(props) {
  let warning;
  if (props.drizzleStatus.warning === 'metamask') {
    warning = (
      <div className="warning">
        Attention! You need the <a href="https://metamask.io/">Metamask</a>{' '}
        desktop browser extention to trade memes.
      </div>
    );
  }
  return (
    <header>
      <Link className="logo" to="/">
        <h1>Meme Lordz</h1>
      </Link>
      <p>
        <i>The first decentralized meme market!</i>
        <br />
        <br />
        Turn any meme into a tradable cryptocurrency. Let the market define its
        value based on popularity.
        <br />
        Buy and sell meme currency on our platform, and start earning. The more
        meme-predicting skills you have, the more you’ll earn!
      </p>
      <p>Built on Ethereum and IPFS.</p>
      <p>
        This is an MVP, follow us on{' '}
        <a href="https://twitter.com/memelordzapp">Twitter</a>,{' '}
        <a href="https://t.me/meme_lordz">Telegram</a> &{' '}
        <a href="https://www.instagram.com/memelordzapp/">Instagram</a> for
        updates.
      </p>
      {warning}
    </header>
  );
}

const mapStateToProps = (state) => ({
  account: state.accounts?.[0],
  network: state.web3?.networkId,
  status: state.web3?.status,
  drizzleStatus: state.drizzleStatus | {}
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
