import React from 'react';
import { connect } from 'react-redux';

function AppLoaderComponent(props) {
  return (
    <div className='appLoader'>
      <div>{props.message || props.children}</div>
    </div>
  );
}

function AppLoaderContainer(props) {
  if (props.drizzleStatus.error) {
    switch (props.drizzleStatus.error) {
      case 'network':
        return <AppLoaderComponent>
            <div className="appLoaderError">
              Please connect Metamask to the Rinkeby network
            </div>
          </AppLoaderComponent>;
      case 'Cannot read property \'web3\' of undefined':
        return <AppLoaderComponent>
            <div className='appLoaderError'>
              You need the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">Metamask</a> browser extention to use this app.
            </div>
          </AppLoaderComponent>;
      default:
        break;
    }
  }
  if (!props.drizzleStatus.initialized) {
    return <AppLoaderComponent message="Connecting..." />;
  }
  if (!props.ProxyFactory || !props.ProxyFactory.events) {
    return <AppLoaderComponent message="Retrieving Memes..." />;
  }
  return props.children;
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory,
  drizzleStatus: state.drizzleStatus,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLoaderContainer);
