import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function BasicSelect() {
  const [outlet, setOutlet] = React.useState('');

  const handleChange = (event) => {
    setOutlet(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120,}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Outlet</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={outlet}
          label="Outlet"
          onChange={handleChange}
        >
          <MenuItem value={10}>All</MenuItem>
          <MenuItem value={10}>Nittabuwa</MenuItem>
          <MenuItem value={20}>Yakkala</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}