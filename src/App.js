
import React, {Component} from 'react';
import { Row  } from "react-bootstrap";
//import { Col  } from "react-bootstrap";
import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
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
    <tr class="">
      <td>{props.symbol}</td>
      <td>{formatQuote(props.latestPrice)}</td>
      <td>{formatChange(props.change)}</td>
      <td>{formatChangePercent(props.changePercent)}</td>
    </tr>
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

  getIEXUrl() {
    const useSandbox = process.env.REACT_APP_USE_SANDBOX === 'true';
    console.log("sandbox:%o  raw:%o", useSandbox, process.env.USE_SANDBOX);
    return useSandbox ? 'https://sandbox.iexapis.com/v1' : 'https://cloud.iexapis.com/v1';
  }

  getQuotes() {
    const API_TOKEN = process.env.REACT_APP_IEX_TOKEN;
    let baseUrl = this.getIEXUrl();
    const symbols = this.state.symbols;
    let filters = ['symbol','latestPrice', 'change', 'changePercent', 'marketCap'];
    let url = `${baseUrl}/stock/market/batch?symbols=${symbols.join(',')}&types=quote&filter=${filters.join(',')}&token=${API_TOKEN}`;
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
      <Container>
          <Row>Quotes</Row>
          <Row>
            <table class="table table-dark table-bordered">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Change %</th>
                </tr>
              </thead>
              <tbody>
                {this.state.quotes.map(quote => <Quote {...quote} />)}
              </tbody>
            </table>
          </Row>
        </Container>
      </div>
    );
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
           IEX Demo
        </p>
        
        <div><QuoteList symbols={['SPY','QQQ','AAPL','TSLA','F']} /></div>
      </header>
    </div>
  );
}

export default App;
