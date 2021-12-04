import React, { useState } from 'react';
import { useWeb3React, useAsync } from '../eth/hooks';
import { networkId } from '../eth/config';
import { chainIdToNetwork } from '../eth/utils';

function AppLoaderComponent(props) {
  return (
    <div className="appLoader">
      <div>{props.message || props.children}</div>
    </div>
  );
}

export default function AppLoaderContainer(props) {
  const { library, active, chainId } = useWeb3React();

  if (!library)
    return (
      <AppLoaderComponent>
        <div className="appLoaderError">
          You need the{' '}
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
            Metamask
          </a>{' '}
          browser extention to use this app.
        </div>
      </AppLoaderComponent>
    );

  // TODO MAKE THIS A BUTTON
  if (active && chainId !== networkId)
    return (
      <AppLoaderComponent>
        <div className="appLoaderError">
          Please connect Metamask to the{' '}
          {chainIdToNetwork?.[networkId]?.toUpperCase()} network
        </div>
      </AppLoaderComponent>
    );

  if (!props.ProxyFactory || !props.ProxyFactory.events) {
    return <AppLoaderComponent message="Retrieving Memes..." />;
  }
  return props.children;
}
