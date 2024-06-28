import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const StatBox = ({ isMobile, isPortrait, title, subtitle, icon, progress, increase, isSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px" sx={{ cursor: 'pointer' }}>
      <Box display="flex" justifyContent={isMobile ? "center" : "space-between"}>
        {isPortrait && <Box>
          {icon}
        </Box>}
        {!isMobile && <Box>
          {/* <ProgressCircle progress={progress} /> */}
          {isSelected && <RadioButtonCheckedIcon fontSize="large" />}
          {!isSelected && <PanoramaFishEyeIcon fontSize="large" color="info" />}
          {/* <RadioButtonCheckedIcon fontSize="large" /> */}
        </Box>}

      </Box>
      <Box>
        <Typography
          variant={isMobile ? "body1" : "h4"}
          fontWeight="bold"
          sx={{ color: isSelected && isMobile ? colors.grey[900] : colors.grey[100], whiteSpace: 'nowrap' }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;