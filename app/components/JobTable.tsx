"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import JobListingsInterface from "../interfaces/JobListingsInterface";
import { useRouter } from "next/navigation";

/**
 * define the columns per MUI specifications
 * https://mui.com/material-ui/react-table/#data-table
 */
const columns: GridColDef[] = [
  // {
  //   field: "rowNumber",
  //   headerName: "",
  //   width: 50,
  //   renderCell: (params) => (
  //     <div
  //       style={{
  //         overflow: "hidden",
  //         textOverflow: "ellipsis",
  //         whiteSpace: "nowrap",
  //         paddingLeft: "10px",
  //       }}>
  //       {params.value}
  //     </div>
  //   ),
  // },
  {
    field: "job_title",
    headerName: "Job Title",
    flex: 0.9,
    minWidth: 180,

    renderCell: (params) => (
      <Tooltip title={params.value || ""} enterDelay={500} leaveDelay={200}>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingLeft: "10px",
          }}>
          {params.value}
        </div>
      </Tooltip>
    ),
  },
  {
    field: "company_name",
    headerName: "Company",
    flex: 0.5,
    minWidth: 140,
    renderCell: (params) => (
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingLeft: "10px",
        }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "tech_stack",
    headerName: "Tech Stack",
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ""} enterDelay={500} leaveDelay={200}>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingLeft: "10px",
          }}>
          {params.value}
        </div>
      </Tooltip>
    ),
    valueGetter: (params: GridValueGetterParams) =>
      (params.row.tech_stack || []).join(", "),
  },
  {
    field: "location",
    headerName: "Location",
    flex: 0.8,
    minWidth: 100,
    renderCell: (params) => (
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingLeft: "10px",
        }}>
        {params.value}
      </div>
    ),
    valueGetter: (params: GridValueGetterParams) => params.row.location,
  },
  {
    field: "salary",
    headerName: "Salary",
    flex: 0.6,
    minWidth: 120,
    renderCell: (params) => {
      //TODO: I beleive this can be refactored, but bc I did not have the latest backend changes it was breaking the app, returning an object

      let displayValue = params.value;
      if (typeof displayValue === "object") {
        displayValue = displayValue
          ? JSON.stringify(displayValue)
          : "Not Provided";
      } else if (displayValue === undefined || displayValue === null) {
        displayValue = "Not Provided";
      }
      return (
        <Tooltip title={displayValue} enterDelay={500} leaveDelay={200}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingLeft: "10px",
            }}>
            {displayValue}
          </div>
        </Tooltip>
      );
    },
    valueGetter: (params: GridValueGetterParams) =>
      params.row.salary || "Not Provided",
  },
  {
    field: "job_scraped_date",
    headerName: "Date Added",
    flex: 0.4,
    minWidth: 90,
    renderCell: (params) => (
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingLeft: "10px",
        }}>
        {params.value}
      </div>
    ),
  },
];

interface JobTableProps {
  descriptions: Array<JobListingsInterface>;
}

/**
 *MUI Datagrid component used to render the jobs table
 * docs: https://mui.com/x/react-data-grid/
 * we are using the MIT version (Free Forever)
 */
export default function JobTable({ descriptions }: JobTableProps) {
  const router = useRouter();

  function formatDate(date: Date) {
    const month = date.getMonth() + 1; // getMonth() is zero-based
    let day = date.getDate();
    const year = date.getFullYear();

    // Format the date as mm/dd/yyyy'
    console.log(day.toString().length === 2 ? "0" + day.toString() : day)
    return `${month}/${day.toString().length === 1 ? "0" + day.toString() : day}/${year}`;
  }

  /**
   * build the rows for the data grid
   */
  const rows = descriptions.map((description, index) => ({
    id: description.id,
    rowNumber: index + 1,
    job_title: description.job_title,
    tech_stack: description.json_response.tech_stack,
    location: description.json_response.location,
    company_name: description.company_name,
    salary: description.json_response.salary,
    job_scraped_date: formatDate(new Date(description.job_scraped_date)),
  }));

  /**
   * click handler to handle navigation to job details pages
   */
  const handleRowClick = (params: any) => {
    router.push(`/listings/${params.id}`);
  };

  return (
    <Box
      sx={{
        height: 680,
        width: "90%",
        backgroundColor: "#eaeaea",
        marginTop: "20px",
        marginBottom: "80px",
        borderRadius: "20px",
        boxShadow: "1px 4px 12px #686767",
      }}>
      <DataGrid
        sx={{
          border: "none",
          // Remove border from the DataGrid itself
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#bab6b6",
            color: "#ffffff",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            paddingLeft: "10px",
          },
          "& .MuiDataGrid-footerContainer": {
            color: "#ffffff",
            backgroundColor: "#bab6b6",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          },
        }}
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
        initialState={{
          sorting: {
            sortModel: [{ field: 'job_scraped_date', sort: 'desc' }], 
          },
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
}
