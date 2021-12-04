import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import { AppLoader, Header, Footer } from './common';
import { MemeIndex, MemeShow } from './memes';
import actions from './actions';
import { useProxyEvent } from './eth/hooks';

const App = () => {
  // componentDidMount() {
  //   // fetch events here
  // }
  const { res: createEvent } = useProxyEvent();
  console.log(createEvent);
  // componentDidUpdate(lastProps) {
  //   if (this.props.ProxyFactory.events === lastProps.ProxyFactory.events)
  //     return;
  //   // handle create events and grab
  //   // BondingCurveContract at addres
  //   //         eventName: 'StoreHash',
  //   //         eventOptions: {
  //   //           fromBlock: e.blockNumber
  //   //         }

  //   // this.props.ProxyFactory.events.forEach((e) => {
  //   //   let address = e.returnValues.proxyAddress;
  //   //   if (this.props.memes.indexOf(address) !== -1) return;
  //   //   drizzle.addContract(BondingCurveContract, {
  //   //     name: address,
  //   //     address,
  //   //     events: [
  //   //       {
  //   //         eventName: 'StoreHash',
  //   //         eventOptions: {
  //   //           fromBlock: e.blockNumber
  //   //         }
  //   //       }
  //   //     ]
  //   //   });
  //   //   this.props.actions.addMeme(address);
  //   // });
  // }

  //     this.props.actions.addMeme(address);

  return (
    <div className="container">
      <Header />
      <AppLoader>
        <Switch>
          <Route exact path="/" component={MemeIndex} />
          <Route exact path="/:board/" component={MemeIndex} />
          <Route exact path="/meme/:address" component={MemeShow} />
          <Route exact path="/:board/:page/" component={MemeIndex} />
          <Route exact path="/:board/:sort/:page/" component={MemeIndex} />
          <Route
            exact
            path="/:board/:sort/:page/:catalog/"
            component={MemeIndex}
          />
          <Route render={() => <div>404</div>} />
        </Switch>
      </AppLoader>
      <Footer />
    </div>
  );
};

export default App;
