import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  styled,
} from "@mui/material";
import useTable from "./useTable";

// Styled Buttons (Edit = Red, Delete = Blue)
const EditButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  margin: theme.spacing(0.5),
  backgroundColor: "#e57373", // Light red
  color: "#b71c1c", // Dark red text
  "&:hover": {
    backgroundColor: "#b71c1c", // Darker red on hover
    color: "#fff",
  },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  margin: theme.spacing(0.5),
  backgroundColor: "#64b5f6", // Light blue
  color: "#0d47a1", // Dark blue text
  "&:hover": {
    backgroundColor: "#0d47a1", // Darker blue on hover
    color: "#fff",
  },
}));

// Styles for the table container and layout
const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  maxHeight: 400,
}));

const TableRowStyled = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const NoDataMessage = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.2rem",
  color: theme.palette.text.secondary,
}));

// Define table headers
const headCells = [
  { id: "eventName", label: "Event Name" },
  { id: "eventDate", label: "Event Date" },
  { id: "location", label: "Location" },
  { id: "eventType", label: "Event Type" },
  { id: "actions", label: "Actions", disableSorting: true },
];

// EventTable component
const EventTable = ({ events, handleEdit, handleDelete }) => {
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(events, headCells, { fn: (records) => records });

  if (events.length === 0) {
    return <NoDataMessage>No events available.</NoDataMessage>;
  }

  return (
    <TableContainerStyled component={Paper}>
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((event) => (
            <TableRowStyled hover key={event._id}>
              <TableCell>{event.name || event.title || "No Name"}</TableCell>
              <TableCell>
                {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>
                <EditButton onClick={() => handleEdit(event,event._id)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(event._id)}>Delete</DeleteButton>
              </TableCell>
            </TableRowStyled>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    </TableContainerStyled>
  );
};

export default EventTable;