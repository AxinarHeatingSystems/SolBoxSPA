import React from "react";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export const AddDevModal = ({ isAddDev, onClose }) => {
  return (
    <Modal
      open={isAddDev}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h2" component="h2">
          Add New Device
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Grid container direction={'row'} spacing={3} >
            <Grid xs={6} padding={1}>
              <TextField fullWidth id="outlined-basic" label="Country" variant="outlined" size="small" required />
            </Grid>
            <Grid xs={6} padding={1}>
              <TextField fullWidth id="outlined-basic" label="City" variant="outlined" size="small" required />
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label="Water Tank Limit" variant="outlined" size="small" required />
            </Grid>
            <Grid xs={4} padding={1}>
              <FormControlLabel
                value="start"
                control={<Checkbox />}
                label="Alternative heat source available"
                labelPlacement="start"
              />
            </Grid>
            <Grid xs={8} padding={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Type of heat source</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Type of heat source"
                >

                  <MenuItem value={10}>Electric heater</MenuItem>
                  <MenuItem value={20}>Gas boiler</MenuItem>
                  <MenuItem value={30}>Diesel boiler</MenuItem>
                  <MenuItem value={40}>Pellet boiler</MenuItem>
                  <MenuItem value={50}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label="SoloPanel Max Power" variant="outlined" size="small" required />
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label="Name Of Installation" variant="outlined" size="small" required />
            </Grid>
            <Divider />
            <Grid xs={12} padding={1}>

            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}