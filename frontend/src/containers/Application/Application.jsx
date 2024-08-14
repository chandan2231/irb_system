import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchBar from '../../components/SearchBar/SearchBar';
import CommonButton from '../../components/CommonButton';
import AddApplication from './AddApplication';
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import { fetchApplicationList, createApplication, changeStatus } from "../../services/Application/ApplicationService";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];



function Application(){
    const theme = useTheme();
    const dispatch = useDispatch();
    const [personName, setPersonName] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [open, setOpen] = useState(false);
    const [applicationDataList, setApplicationDataList] = React.useState([]);
    const [paginationModel, setPaginationModel] = React.useState({page: 0, pageSize: 5});
    const columns = [
        { 
            field: 'name', 
            headerName: 'Name', 
            flex: 1,
            renderCell: (params) => (
                <a href={`/market-details/`}>{params.value}</a>
            )
        },
        { 
            field: 'code', 
            headerName: 'Code', 
            flex: 1, 
        },
        {
            field: 'market',
            headerName: 'Market',
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <ToggleStatus status={params.row.status}/>
            )
        },
        {
            field: 'createdDate',
            headerName: 'Created Date',
            flex: 1,
        },
        {
            field: 'updatedDate',
            headerName: 'Updated Date',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<RadioButtonUncheckedIcon />}
                    label="Change Status"
                    onClick={handleChangeStatus(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<EditNoteIcon />}
                    label="Edit"
                    onClick={handleItemEdit(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<SettingsSuggestIcon />}
                    label="Details"
                    onClick={handleItemDetail(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleItemDelete(params)}
                    showInMenu
                />,
            ],
        },
    ];
    var totalElements = 0;
    const { applicationList, loading, error, createdApplication } = useSelector(
        state => ({
            error: state.application.error,
            applicationList: state.application.applicationList,
            loading: state.application.loading,
            createdApplication: state.application.createdApplication
        })
    );
    useEffect(() => {
        const data = { page: paginationModel.page, size: paginationModel.pageSize };
        dispatch(fetchApplicationList(data));
    }, [dispatch, paginationModel.page, paginationModel.pageSize]);

    //const {totalElements} = applicationList;
    if(applicationList !== '' && applicationList?.content?.length > 0){
        totalElements = applicationList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    useEffect(() => {
        const applicationListArr = []
        if(applicationList && applicationList?.content?.length > 0) {
            applicationList.content.map((aList, index) => {
            let applicationObject = {
                    id: aList.id,
                    name:  aList.name,
                    code:  aList.market?.code,
                    market:  aList.market?.name,
                    status:  aList.enabled,
                    createdDate: moment(aList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(aList.updated_at).format("DD-MM-YYYY"),
                }
                applicationListArr.push(applicationObject)
            })
            setApplicationDataList(applicationListArr)
        }
    }, [applicationList]);

    const handleChange = (event) => {
        const {target: { value }} = event;
        setPersonName(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSearch = (value) => {
        setSearchData(value);
    };

    const addNew = () => {
        setOpen(true);
    };

    const addNewData = (data) => {
        const {name, description, market_id} = data
        let dataObject = {
            name: name,
            description: description,
            market_id: market_id.id,
        }
        dispatch(createApplication(dataObject));
        setOpen(false);
    };

    useEffect(() => {
        if(createdApplication){
            const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
            dispatch(fetchApplicationList(paginationData));
        }
    }, [createdApplication])

    const handleChangeStatus = (status) => {
        if(status.value === true || status.value === false){
            let data = {id: status.id, status: status.row.status}
            dispatch(changeStatus(data));
        }
    }

    const handleItemDelete = (params) => {
        //console.log('Delete Item', params)
    }

    const handleItemDetail = (params) => {
        //console.log('Details Item', params)
    }
    
    const handleItemEdit = (params) => {
        //console.log('Edit Item', params)
    }
    
    return(
        <Box m={theme.layoutContainer.layoutSection}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={4} md={8} lg={8}>
                        <Typography sx={StyleSheet.pageTitle} variant="h5" mb={2}>Application</Typography>
                    </Grid>
                    <Grid item xs={8} sm={8} md={4} lg={4} justifyContent="flex-end">
                        <Box display="flex" justifyContent="flex-end">
                            <CommonButton 
                                variant="contained"
                                onClick={addNew}
                                startIcon = {<AddOutlinedIcon />}
                            >
                                Add Application
                            </CommonButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <AddApplication open={open} onClose={() => setOpen(false)} addNewData={addNewData}/>
            </Box>
            {/* <Box sx={{mt: 5}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormControl sx={{width: '100%' }} variant="outlined">
                            <SearchBar 
                                placeholder="Search for application"
                                onChange={(event) => handleSearch(event.target.value)}
                                searchBarWidth='100%'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                    <FormControl sx={{ width: '100%'}}>
                        <Select
                            displayEmpty
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                    return <em>Search by: Application</em>;
                                }
                                return selected.join(', ');
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem disabled value="">
                            <em>Search by: Application</em>
                        </MenuItem>
                        {names.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                            >
                            {name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={1} lg={1}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="outlined" startIcon={<CloseOutlinedIcon />} size="large" style={{lineHeight: '2.4375em'}}>
                                Reset
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box> */}
            <Box sx={{mt: 5}}>
            <DataGrid
                rows={applicationDataList}
                columns={columns}
                rowCount={rowCount}
                loading={loading}
                pageSizeOptions={[5]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                onCellClick={(param) => handleChangeStatus(param)}
            />
            </Box>
        </Box>
    )
}

export default Application;