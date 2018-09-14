import React from 'react';
import PropTypes from 'prop-types';
import { ChanDate, toNumber, pad } from '../util';

const Recharts = require('recharts');

const {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ReferenceDot,
  ComposedChart
} = Recharts;

class PriceChart extends React.Component {
  static contextTypes = {
    contractActions: PropTypes.object,
    contractParams: PropTypes.object,
  }

  state = {
    priceInEth: true,
  }

  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
    this.formatTick = this.formatTick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.documentReady = true;
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.events !== nextProps.events) {
      return true;
    }
    if (nextState.priceInEth !== this.state.priceInEth) {
      return true;
    }
    return false;
  }

  getChartData(events) {
    let { priceInEth } = this.state;
    let value = 0;
    let minTimestamp = events[0][1];
    let values = events.map(([event, timestamp]) => {
      switch (event.event) {
        case 'Minted':
          value += toNumber(priceInEth ? event.returnValues.totalCost : event.returnValues.amount, 18);
          break;
        case 'Burned':
          value -= toNumber(priceInEth ? event.returnValues.reward : event.returnValues.amount, 18);
          break;
        default:
          break;
      }
      return {
        time: timestamp - minTimestamp,
        when: new Date(timestamp * 1000).toString(),
        value,
      };
    });
    values.push({
      time: Date.now() / 1000 - minTimestamp,
      value,
    });
    return values;
  }

  formatTick(time) {
    const minTimestamp = this.props.events[0][1];
    time += minTimestamp;
    time *= 1000;
    const date = new Date(time);
    if (!date) return '';
    return date.getMonth() + '/' + pad(date.getDate(), 2) + ' ' + date.getHours() + ':' + pad(date.getMinutes(), 2);
  }

  toggle() {
    this.setState({ priceInEth: !this.state.priceInEth });
  }

  render() {
    if (!this.documentReady) return null;
    let { events, currentPrice, symbol } = this.props;
    if (!events || !events.length) return null;
    let values = this.getChartData(events);
    let price = values[values.length - 1];
    let width = Math.min(600, (window.innerWidth < 480 ? window.innerWidth : 480) - 30);
    let height = width * 2 / 3;
    return (
      <div >
        <ComposedChart
          style={{ margin: 'auto' }}
          width={width}
          height={height}
          data={values}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="time"
            type="number"
            tickFormatter={this.formatTick}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            label={{ value: this.state.priceInEth ? 'ETH' : symbol, angle: -90, position: 'insideLeft' }} 
            dataKey="value"
            type='number'
          />
          <Area isAnimationActive={false} type="stepAfter" dataKey="value" stroke="blue" fill="blue" />
          <ReferenceDot
            isFront={true}
            ifOverflow="extendDomain"
            x={price.time}
            y={price.value}
            r={5}
            fill="white"
            stroke="blue"
          />
          <Tooltip />
        </ComposedChart>
        <div className='row'>
          <button onClick={this.toggle}>
            {this.state.priceInEth ? 'View ' + symbol + ' supply' : 'View prices in ETH'}
          </button>
        </div>
      </div>
    );
  }
}

export default PriceChart;
