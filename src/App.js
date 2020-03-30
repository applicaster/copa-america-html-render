import React, { Component } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import './App.css';

const WP_BASE_URL = 'https://public-api.wordpress.com/wp/v2/sites/copaamericacom.wordpress.com'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      params: {},
      htmlContent: ''
    };

    this.getParams = this.getParams.bind(this);
    this.getHTMLContent = this.getHTMLContent.bind(this);
  }

  async componentDidMount() {
    await this.getParams()
    await this.getHTMLContent()
  }

  getHTMLContent() {
    const {
      category,
      id,
      country,
      langLocale
    } = this.state.params;

    axios.get(`${WP_BASE_URL}/${category}`).then(response => {
      let htmlContent;
      let cityData;

      cityData = response.data.filter(item => item.slug === id || item.slug === country);

      const {
        acf: {
          html_content_spanish,
          html_content_portuguese,
          html_content_english
        }
      } = cityData[0];

      switch (langLocale) {
        case "es":
          htmlContent = html_content_spanish
          break;
        case "en":
          htmlContent = html_content_english
          break;
        case "pt":
          htmlContent = html_content_portuguese
          break;
        default:
          htmlContent = html_content_english
      }

      this.setState({
        htmlContent
      })
    });
  }

  getParams() {
    const windowURL = window.location.search;
    const urlParams = new URLSearchParams(windowURL);

    const params = {
      country: urlParams.get('country'),
      id: urlParams.get('id'),
      langLocale: urlParams.get('langLocale'),
      category: urlParams.get('category')
    }

    this.setState({
      params
    });
  }

  render() {
    return (
      <div className="App">
        {parse(this.state.htmlContent)}
      </div>
    );
  }
}

App.displayName = 'App';
export default App;
