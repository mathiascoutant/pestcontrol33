import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CustomTabPanel from "./CustomTabPanel";

function CustomTabs() {
  const [value, setValue] = React.useState("0");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Home" icon={<HomeIcon />} />
          <Tab label="Virements" icon={<ArrowUpwardIcon />} />
          <Tab label="Historique" icon={<RotateLeftIcon />} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}

export default CustomTabs;
