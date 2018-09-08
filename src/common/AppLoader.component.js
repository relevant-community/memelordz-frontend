import React from 'react';
import { connect } from 'react-redux';

function AppLoaderComponent(props) {
  return (
    <div className='appLoader'>
      <div>{props.message}</div>
    </div>
  );
}

function AppLoaderContainer(props) {
  if (!props.drizzleInitialized) {
    return <AppLoaderComponent message="Connecting..." />;
  }
  if (!props.ProxyFactory || !props.ProxyFactory.events) {
    return <AppLoaderComponent message="Retrieving Memes..." />;
  }
  return props.children;
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory,
  drizzleInitialized: state.drizzleStatus.initialized,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLoaderContainer);
