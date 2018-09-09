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
    let { totalSupply, poolBalance } = this.props.data;
    let props = { ...this.props.data };

    poolBalance = parseFloat(poolBalance) || 0;
    totalSupply = parseFloat(totalSupply) || 0;

    props.exponent = 2;
    props.slope = 1000;
    props.poolBalance = poolBalance;
    props.totalSupply = totalSupply;

    let data = [];
    let step = (totalSupply || 50) / 100;

    let price = 1 / props.slope * (totalSupply ** props.exponent);
    let currentPrice = { supply: totalSupply, value: price };

    for (let i = step; i < (totalSupply || 50) * 1.5; i += step) {
      price = 1 / props.slope * (i ** props.exponent);
      if (i < totalSupply) {
        data.push({ supply: i, sell: price.toFixed(4), value: parseFloat(price.toFixed(4)) });
      } else if (i >= totalSupply) {
        data.push({ supply: i, buy: price.toFixed(4), value: parseFloat(price.toFixed(4)) });
      }
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
            r={16}
            // fill="blue"
            stroke="blue"
            label={currentPrice.value.toFixed(2)}
          />

        </ComposedChart>
      </div>
    );
  }
}

export default BondingCurveChart;
