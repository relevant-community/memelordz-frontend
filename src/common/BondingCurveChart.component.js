import React from 'react';
import PropTypes from 'prop-types';
import { calculateSaleReturn, calculatePurchaseReturn } from '../util';

const Recharts = require('recharts');

const {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ComposedChart
} = Recharts;

class BondingCurveChart extends React.Component {
  static contextTypes = {
    contractActions: PropTypes.object,
    contractParams: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
  }

  componentDidMount() {
    this.documentReady = true;
    this.forceUpdate();
  }

  getChartData() {
    let { totalSupply, reserveRatio, poolBalance } = this.props.data;
    let props = { ...this.props.data };

    poolBalance = parseFloat(poolBalance) || 0;
    reserveRatio = parseFloat(reserveRatio) || 1;
    totalSupply = parseFloat(totalSupply) || 50;

    props.exponent = 2;
    props.slope = 1;
    props.poolBalance = poolBalance;
    props.totalSupply = totalSupply;

    let data = [];
    let step = Math.round(totalSupply / 100) || 0.1;
    // let price = poolBalance / (reserveRatio * totalSupply);
    let eth = calculateSaleReturn({ ...props, amount: 0 });
    let price = (poolBalance - eth) / totalSupply;
    let currentPrice = { supply: totalSupply, value: price };

    for (let i = step; i < totalSupply * 1.5; i += step) {
      // if (i < totalSupply) {
        eth = 1 * calculateSaleReturn({ ...props, amount: totalSupply - i });
        price = (parseFloat(poolBalance, 10) - eth) / (reserveRatio * i);
        data.push({ supply: i, sell: price.toFixed(1), value: parseFloat(price.toFixed(1)) });
      // } else if (i >= totalSupply) {
      //   let eth = 1 * calculatePurchaseReturn({ ...props, amount: i - totalSupply });
      //   price = (eth + parseFloat(poolBalance, 10)) / (reserveRatio * i);
      //   data.push({ supply: 1 * i, buy: price.toFixed(1), value: 1 * price });
      // }
    }
    return { data, currentPrice };
  }

  render() {
    if (!this.documentReady) return null;
    let { data, currentPrice } = this.getChartData();
    let width = Math.min(600, (window.innerWidth < 480 ? window.innerWidth : 480) - 30);
    let height = width * 2 / 3;
    return (
      <div >
        <ComposedChart
          style={{ margin: 'auto' }}
          width={width}
          height={height}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="supply" type={'number'} />
          <YAxis dataKey="value" type={'number'} />
          <Tooltip/>

          <Area isAnimationActive={false} dots={false} stackOffset={'none'} dataKey="value" name={'price'} key={'price'} stroke='blue' fill='none'/>

          <Area isAnimationActive={false} stackOffset={'none'} dataKey="sell" stroke="blue" fill='blue' />

          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={currentPrice.supply}
            y={currentPrice.value}
            r={8}
            fill="blue"
            stroke="none"
          />

        </ComposedChart>
      </div>
    );
  }
}

export default BondingCurveChart;
