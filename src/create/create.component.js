import React, { Component } from 'react';
import ipfsAPI from 'ipfs-api';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as multihash from '../eth/multihash';
import { BONDING_CURVE_CONTRACT } from '../eth/drizzle.config';
import './create.css';

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const { Buffer } = ipfs;

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
    let web3 = this.props.drizzle.web3;

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
      this.setState({ processing: true, lastTxId: txId });
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
  }

  async upload() {
    try {
      if (this.state.processing) {
        return window.alert('still processing previous transaction');
      }
      let file = this.fileInput.files[0];
      file = await loadFile(file);
      const buff = Buffer(file);
      const result = await ipfs.add(buff, { progress: (prog) => console.log(prog) });
      console.log(result);
      this.setState({ hash: result[0].path });
      this.createMemeContract(result[0].path);

    } catch (err) {
      console.log(err);
    }
  }

  // <img src={'http://ipfs.io/ipfs/' + this.state.hash} />

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    let processing;
    if (this.state.lastTxHash) {
      processing = <div className="processing">processing transaction: {this.state.lastTxHash}</div>;
    }
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
            <button onClick={this.upload.bind(this)}>Create Meme Contract</button>
          </div>
        </div>
        {processing}
        { this.state.preview ?
        <div className='uploadPreview'>
          <img src={this.state.preview} />
        </div>
        : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.accounts[0],
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
