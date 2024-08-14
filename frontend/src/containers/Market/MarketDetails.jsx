import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import TabPanel from "../../components/TabPanel";
import {DataGrid} from "@mui/x-data-grid";

const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      flex: 1, 
    },
    {
      field: 'firstName',
      headerName: 'First name',
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      flex: 1,
    },
    {
      field: 'age',
      headerName: 'Age',
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


function MarketDetails(){
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    return(
        <Box sx={{ p: 3, m: 3}}>
            <Typography sx={StyleSheet.pageTitle} variant="h5" mb={2}>Market Details</Typography>
            <Box sx={{borderBottom: '1px', borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Details" id='tab-0'></Tab>
                    <Tab label="Device" id='tab-1'></Tab>
                    <Tab label="History" id='tab-2'></Tab>
                    <Tab label="Authorized Applications" id='tab-3'></Tab>
                    <Tab label="Permissions" id='tab-4'></Tab>
                    <Tab label="Roles" id='tab-5'></Tab>
                </Tabs>
                <TabPanel value={value} index={0}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                    >
                    </DataGrid>
                </TabPanel>
            </Box>
        </Box>
        
    )
}

export default MarketDetails;