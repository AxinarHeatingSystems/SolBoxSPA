import React, { useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import { getAllUsers } from '../../axios/ApiProvider';

export const ShareBoards = () => {
  useEffect(() => {
    loadAllUsers();
  }, [])
  const loadAllUsers = async () => {
    const allUsers = await getAllUsers();
    console.log('getAllUsers', allUsers);
  }
  return (
    <Box>
      <Typography variant='h1'>
        Here is the ShareBoard Content
      </Typography>
    </Box>
  )
}