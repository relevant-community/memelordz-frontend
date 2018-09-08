import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './portfolio.css';

class Portfolio extends Component {
  render() {
    // let { events } = this.props.ProxyFactory;
    // let memes = events.map(meme => {
    //   if (!meme) return null;
    //   let address = meme.returnValues.proxyAddress;
    //   return <Meme key={address} address={address} />;
    // });

    return (
      <div>
        <h2>Your Portfolio</h2>
        <hr />
        <div className='loadingMessage'>
          Loading memes...
        </div>
      </div>
    );

    // return (
    //   <div>
    //     <h2>Your Portfolio</h2>
    //     <hr />
    //     <div>
    //       {memes}
    //     </div>
    //   </div>
    // );
  }
}

function mapStateToProps(state) {
  return {
    account: state.accounts[0],
    accountBalances: state.accountBalances,
  };
}

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
