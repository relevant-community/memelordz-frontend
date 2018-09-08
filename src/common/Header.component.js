import React from 'react';
import { connect } from 'react-redux';

function Header(props) {
  return (
    <div className='header'>
      <h1>
        Meme Lordz
      </h1>
      <p>
        A fully decentralized curation market for memes! You can an ERC20 token
        by uploading a meme and invest in memes by buying their tokens!
      </p>
      <p>
        Built on Ethereum and IPFS
      </p>
      <table className='status'>
        <tbody>
          <tr>
            <td>Web3</td>
            <td>{props.status}</td>
          </tr>
          <tr>
            <td>Drizzle</td>
            <td>{props.drizzleStatus ? 'initialized' : 'initializing...'}</td>
          </tr>
          <tr>
            <td>Account</td>
            <td>{props.account}</td>
          </tr>
          <tr>
            <td>Network</td>
            <td>{props.network}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = (state) => ({
  account: state.accounts[0],
  network: state.web3.networkId,
  status: state.web3.status,
  drizzleStatus: state.drizzleStatus.initialized,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
