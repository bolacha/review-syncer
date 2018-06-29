import React from 'react';
import ReactDOM from 'react-dom';
import Grid from '@material-ui/core/Grid';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Grid container style={{width: '800px', margin: '0 auto'}}>
        <App />
        </Grid>, document.getElementById('root'));
registerServiceWorker();
