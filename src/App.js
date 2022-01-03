import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function formatChange(value) {
  if (value === null || value === undefined) return '';
  return value.toLocaleString('en', {'minimumFractionDigits': 2});
}

function formatChangePercent(value) {
  if (value === null || value === undefined) return '';
  return (value * 100).toFixed(1) + '%';
}

function formatQuote(value) {
  let options = {
    'minimumFractionDigits': 2,
    'style': 'currency',
    'currency': 'USD'
  };
  return value.toLocaleString('en', options);
}

function Quote(props) {
  console.log("Quote props:%o", props);
  return (
    <div>
      <div>{props.symbol} : {formatQuote(props.latestPrice)}  Chg: {formatChange(props.change)} :{formatChangePercent(props.changePercent)}</div>
    </div>
    );
}

/* 
 * Main component  for listing quotes
*/
class QuoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [],
      symbols: props.symbols || [],
    }
  }

  getQuotes() {
    const API_TOKEN = process.env.REACT_APP_IEX_TOKEN;
    const BASE_URL = "https://cloud.iexapis.com/v1";
    const symbols = this.state.symbols;
    let filters = ['symbol','latestPrice', 'change', 'changePercent', 'marketCap'];
    let url = `${BASE_URL}/stock/market/batch?symbols=${symbols.join(',')}&types=quote&filter=${filters.join(',')}&token=${API_TOKEN}`;
    console.log("url: %o ", url);

    fetch(url).then(response => response.json()).then(json => {
      console.log("JSON:%o",json);
      // retire this code
      var qq = [];
      symbols.forEach(symbol => {
        var data = json[symbol].quote;
        console.log("data:%o", data);
        let price = data.latestPrice;
        console.log("symol:%o price: %o ", symbol, price);
        qq.push(data);
      });
      console.log("qq:%o", qq);
      this.setState({ quotes: qq });
    });
    console.log("quotes:%o", this.state.quotes);
  }

  componentDidMount() {
    this.getQuotes();
  }

  render() {
    return (
      <div>
        <h4>Quotes</h4>
        <div>
          {this.state.quotes.map((quote, index) => <Quote key={index} {...quote} />)}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
           IEX Demo
        </p>
        
        <div><QuoteList symbols={['SPY','QQQ','AAPL','TSLA']} /></div>
      </header>
    </div>
  );
}

export default App;
