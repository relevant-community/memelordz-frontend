import React, { Component } from 'react';
import ipfsAPI from 'ipfs-api';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Web3 from 'web3';
import * as multihash from '../eth/multihash';
import { drizzle, BONDING_CURVE_CONTRACT } from '../eth/drizzle.config';
import { calculatePurchaseReturn, toNumber, toFixed } from '../util';
import './create.css';

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const { Buffer } = ipfs;
const { BN } = Web3.utils;

function loadFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsArrayBuffer(file);
  });
}

const initialState = {
  name: '',
  symbol: '',
  hash: '',
  preview: null,
  processing: false,
  lastTxId: null,
  lastTxHash: null,
  amount: '',
  modal: false,
};

class Create extends Component {

  state = { ...initialState };

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.lastTxId !== null) {
      let lastTxHash = props.transactionStack[state.lastTxId];
      if (!lastTxHash) return null;

      let { status, error } = props.transactions[lastTxHash];
      if (status === 'error') {
        window.alert('Your transaction failed :(' + error);
        return { lastTx: null, processing: null };
      }
      if (status === 'success') {
        window.alert('Your transaction has been confirmed!');
        return initialState;
      }
      return { lastTxHash };
    }
    return null;
  }

  componentDidMount() {
  }

  getContractData() {
    let ipfsHash = multihash.getBytes32FromMultiash(this.state.hash);

    // need this?
    let web3 = drizzle.web3;

    let data = web3.eth.abi.encodeFunctionCall({
      name: 'initContract',
      type: 'function',
      inputs: [{
        type: 'string',
        name: '_name'
      }, {
        type: 'uint8',
        name: '_decimals'
      }, {
        type: 'string',
        name: '_symbol'
      }, {
        type: 'uint8',
        name: '_exponent'
      }, {
        type: 'uint32',
        name: '_slope'
      }, {
        type: 'bytes32',
        name: '_hash'
      }, {
        type: 'uint8',
        name: '_hashFunction'
      }, {
        type: 'uint8',
        name: '_size'
      }
      ]
    }, [
      this.state.name,
      '18',
      this.state.symbol,
      '2',
      '1000',
      ipfsHash.digest,
      ipfsHash.hashFunction,
      ipfsHash.size
    ]
    );
    return data;
  }

  async createMemeContract() {
    try {
      let data = this.getContractData();
      console.log('state', this.state);
      console.log('data ', data);
      let txId = await this.props.ProxyFactory.methods.createProxy.cacheSend(BONDING_CURVE_CONTRACT, data);
      console.log('tx ', txId);
      this.setState({ processing: false, lastTxId: txId });
    } catch (err) {
      console.log(err);
    }
  }

  displayPreview() {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ preview: e.target.result });
    };
    reader.readAsDataURL(this.fileInput.files[0]);
    this.showModal();
  }

  async upload() {
    try {
      if (this.state.processing) {
        return window.alert('still processing previous transaction');
      }
      this.setState({ processing: true });

      let { account, decimals } = this.props;
      let { amount } = this.state;

      if (!account) {
        return window.alert('Missing account — please log into Metamask');
      }

      let file = this.fileInput.files[0];
      file = await loadFile(file);
      const buff = Buffer(file);
      const result = await ipfs.add(buff, { progress: (prog) => console.log(prog) });
      console.log(result);

      this.setState({ hash: result[0].path });
      this.createMemeContract(result[0].path);

      // TODO: execute initial trade when creating the contract
      // this was copied from the trade component:
      /*
      if (!!amount && amount > 0) {
        let numOfTokens = calculatePurchaseReturn(this.state);
        numOfTokens = Web3.utils.toWei(amount.toString());
        // numOfTokens = new BN(numOfTokens.toString());
        // amount += .1;
        amount = Web3.utils.toWei(amount.toString());
        amount = new BN(amount.toString());

        // let priceToMint = await this.props.contract.methods.priceToMint.call(amount);
        // console.log('price to mint ', priceToMint);
        // console.log('our price     ', amount);

        contract.methods.mint.cacheSend(numOfTokens, {
          value: amount, from: account
        });
      }
      */
    } catch (err) {
      console.log(err);
    }
    this.setState({ processing: false });
    return null;
  }

  // <img src={'http://ipfs.io/ipfs/' + this.state.hash} />

  handleInputChange(event) {
    const { target } = event;
    let { type, name, value } = target;
    if (type === 'checkbox') {
      value = target.checked;
    } else if (name === 'symbol') {
      value = (value || '').toUpperCase();
    }
    if (name === 'name') {
      const s = value.toUpperCase();
      const car = s.substr(0, 1);
      const cdr = s.substr(1).replace(/[AEIOUY]/g, '');
      this.setState({
        [name]: value,
        symbol: (car + cdr).substr(0, 9),
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  showModal() {
    if (!this.state.name) {
      this.setState({ error: 'Please title your meme' });
      this.nameInput.focus();
    } else if (!this.state.symbol) {
      this.setState({ error: 'Please pick a ticker symbol' });
      this.symbolInput.focus();
    } else if (this.fileInput.files.length === 0) {
      this.setState({ error: 'Please select an image' });
    } else {
      this.setState({ modal: true, error: '' });
    }
  }

  hideModal() {
    this.setState({ modal: false });
  }

  render() {
    return (
      <div>
        <div className="newForm">
          <h2>Upload a Meme</h2>
          <div>
            <label>Name</label>
            <input
              name='name'
              maxLength="20"
              type='text'
              placeholder='meme name'
              autoComplete='off'
              ref={c => this.nameInput = c}
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Token Symbol</label>
            <input
              name='symbol'
              maxLength="9"
              type='text'
              placeholder='SYMB'
              autoComplete='off'
              ref={c => this.symbolInput = c}
              value={this.state.symbol}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Image</label>
            <input
              ref={c => this.fileInput = c}
              onChange={this.displayPreview.bind(this)}
              name="meme"
              type="file"
            />
          </div>
          <div>
            <label className='hidden'></label>
            <button onClick={this.showModal.bind(this)}>Create Meme Contract</button>
          </div>
          <div className='error'>
            {this.state.error}
          </div>
        </div>

        {this.renderModal()}
      </div>
    );
  }

  renderModal() {
    if (!this.state.modal) return null;
    if (!this.props.account || !this.props.accountBalances) return null;

    let processing;
    if (this.state.lastTxHash) {
      processing = <div className="processing">processing transaction: {this.state.lastTxHash}</div>;
    }

    let walletBalance;
    let otherTokenValue;
    let available;

    walletBalance = toNumber(this.props.accountBalances[this.props.account], 18);
    otherTokenValue = (calculatePurchaseReturn({
      exponent: 2,
      totalSupply: 0,
      poolBalance: 0,
      slope: 1,
      amount: this.state.amount || 0,
    }) || 0).toFixed(2);
    available = (
      <a onClick={() => this.setState({ amount: walletBalance })}>
        {(walletBalance || 0).toFixed(2)} ETH
      </a>
    );

    return (
      <div className={this.state.modal ? 'modal visible' : 'modal'} onClick={this.hideModal.bind(this)}>
        <div className='inner' onClick={e => e.stopPropagation()}>
          <div className='heading'>
             Almost there!
             <div className='close' onClick={this.hideModal.bind(this)}>X</div>
          </div>
          <div className='content'>
            <div>
              Be the first to invest in your meme:<br/>
              <b>{this.state.name}</b>
            </div>

            <div className='uploadPreview'>
              <img src={this.state.preview} />
            </div>

            <div>
              How much do you want to invest?
            </div>

            <div className="tradeSection">
              <div>
                <label>
                  {'Pay With: '}
                </label>
                <span>
                  <input
                    placeholder=''
                    onFocus={e => {
                      if (e.target.value === '0') this.setState({ amount: '' });
                    }}
                    autoFocus
                    type="number"
                    name="amount"
                    autoComplete="off"
                    min={0}
                    max={toFixed(walletBalance, 4)}
                    value={this.state.amount}
                    onChange={this.handleInputChange.bind(this)}
                  />
                  {' ETH'}
                </span>
              </div>

              <div>
                <label>
                  Receive:
                </label>
                <span>
                  {otherTokenValue} {this.state.symbol}
                </span>
              </div>

              <div className={'bondedToken-available'}>
                Available: {available}
              </div>

              <div>
                <button onClick={this.upload.bind(this)}>Buy Now</button>
              </div>

              <div>
                <button onClick={this.upload.bind(this)}>Skip it</button>
              </div>
            </div>

            {processing}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.accounts[0],
  accountBalances: state.accountBalances || {},
  ProxyFactory: state.contracts.ProxyFactory,
  network: state.web3.networkId,
  status: state.web3.status,
  drizzleStatus: state.drizzleStatus.initialized,
  transactions: state.transactions,
  transactionStack: state.transactionStack
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
