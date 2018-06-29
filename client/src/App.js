import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import PaginatedList from './PaginatedList';

class App extends Component {

  render() {
    return (
    <Grid container>
        <PaginatedList/>
    </Grid>
    );
  }
}

export default App;
