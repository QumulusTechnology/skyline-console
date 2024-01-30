import { Helmet } from 'react-helmet';
import React from 'react';

import Script from './script';

class Chatbot extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <script type="text/javascript" src={Script} />
        </Helmet>
      </>
    );
  }
}

export default Chatbot;
