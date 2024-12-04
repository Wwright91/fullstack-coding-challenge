import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const AllComplaints = ({ complaints }) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      {complaints.map(
        ({
          complaint_type,
          descriptor,
          unique_key,
          opendate,
          closedate,
          account,
        }) => {
          return (
            <div key={unique_key}>
              <Typography>All Complaints In District {account}</Typography>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                component="nav"
                aria-labelledby="all-complaints"
                subheader={
                  <ListSubheader component="div" id="all-complaints">
                    Complaint {unique_key}
                  </ListSubheader>
                }
              >
                <ListItemButton onClick={handleClick}>
                  <ListItemText
                    primary={
                      <>
                        <p>{`Complaint Type: ${complaint_type || "N/A"}`}</p>
                        <p>{`Description: ${descriptor || "N/A"}`}</p>
                      </>
                    }
                  />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText
                        primary={
                          <>
                            <p>{`Opened On: ${opendate}`}</p>
                            <p>{closedate && `Closed On: ${closedate}`}</p>
                          </>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AllComplaints;
