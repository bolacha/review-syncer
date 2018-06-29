import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import PaginatedList from './PaginatedList';

class App extends Component {

  constructor(state) {
    super(state);
    this.state = {
      shopdomain : '',
      appslug: 'product-upsell'
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
    <Grid container>
      <Grid>
      <Grid item xs={6} >
      <FormControl>
        <InputLabel htmlFor="appslug">App Slug</InputLabel>
        <Select
          value={this.state.appslug}
          onChange={this.handleChange('appslug')}>

          <MenuItem value={"product-upsell"}>product-upsell</MenuItem>
          <MenuItem value={"product-discount"}>product-discount</MenuItem>
        </Select>
      </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="shopdomain"
          label="Shop Domain"
          value={this.state.shopdomain}
          onChange={this.handleChange('shopdomain')}
          margin="normal"
        />
        </Grid>
        </Grid>
        <PaginatedList appslug={this.state.appslug} shopdomain={this.state.shopdomain}/>
    </Grid>
    );
  }
}

export default App;
