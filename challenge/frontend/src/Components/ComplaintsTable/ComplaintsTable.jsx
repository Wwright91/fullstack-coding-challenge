import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "account", label: "Account", minWidth: 120 },
  { id: "complaint_type", label: "Complaint Type", minWidth: 100 },
  {
    id: "descriptor",
    label: "Description",
    minWidth: 170,
  },
  {
    id: "opendate",
    label: "Date Opened",
    minWidth: 170,
  },
  {
    id: "closedate",
    label: "Date Closed",
    minWidth: 170,
  },
];

const ComplaintsTable = ({ complaints }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "90%", overflow: "hidden", aligItems: "ceneter" }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.length > 0 ? (
              complaints
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  ({
                    unique_keys,
                    account,
                    complaint_type,
                    descriptor,
                    opendate,
                    closedate,
                  }) => {
                    return (
                      <TableRow hover tabIndex={-1} key={unique_keys}>
                        <TableCell>{account}</TableCell>
                        <TableCell>{complaint_type}</TableCell>
                        <TableCell>{descriptor || "Not Applicable"}</TableCell>
                        <TableCell>
                          {new Date(opendate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(closedate).toLocaleDateString() ||
                            "Still Pending"}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
            ) : (
              <p style={{ textAlign: "center" }}>
                No complaints for this query.
              </p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {complaints.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={complaints.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default ComplaintsTable;
