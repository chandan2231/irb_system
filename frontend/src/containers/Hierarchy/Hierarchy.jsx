import * as React from 'react';
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
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
import AddHierarchy from './AddHierarchy';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import { fetchHierarchyList, createHierarchy, changeStatus } from '../../services/Hierarchy/HierarchyService';
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


  
function Hierarchy(){
    const theme = useTheme();
    const dispatch = useDispatch();
    const [personName, setPersonName] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = React.useState([]);
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
            field: 'parentRole', 
            headerName: 'Parent Role', 
            flex: 1
        },
        { 
            field: 'childRole', 
            headerName: 'Child Role', 
            flex: 1
        },
        { 
            field: 'market', 
            headerName: 'Market', 
            flex: 1
        },
        { 
            field: 'application', 
            headerName: 'Application', 
            flex: 1
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
            flex: 1
        },
        {
            field: 'updatedDate',
            headerName: 'Updated Date',
            flex: 1
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
    const { hierarchyList, createdHierarchy, loading, error } = useSelector(
        state => ({
            error: state.hierarchy.error,
            hierarchyList: state.hierarchy.hierarchyList,
            loading: state.hierarchy.loading,
            createdHierarchy: state.hierarchy.createdHierarchy,
        })
    );
    useEffect(() => {
        const data = { page: paginationModel.page, size: paginationModel.pageSize };
        dispatch(fetchHierarchyList(data));
    }, [dispatch, paginationModel.page, paginationModel.pageSize]);

    if(hierarchyList !== '' && hierarchyList?.content?.length > 0){
        totalElements = hierarchyList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    useEffect(() => {
        const hierarchyListArr = []
        if(hierarchyList && hierarchyList?.content?.length > 0) {
            hierarchyList.content.map((hList, index) => {
            let memberCount = (Number(hList?.child_role?.length) - 1) 
            let applicationObject = {
                    id: hList.id,
                    name:  hList.name,
                    parentRole:  hList.parent_role?.name,
                    childRole:  memberCount === 0 ? hList.child_role[0]?.name : (hList.child_role[0]?.name+' + '+memberCount),
                    market:  hList.market?.name,
                    application:  hList.application?.name,
                    status:  hList.enabled,
                    createdDate: moment(hList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(hList.updated_at).format("DD-MM-YYYY"),
                }
                hierarchyListArr.push(applicationObject)
            })
            setDataList(hierarchyListArr)
        }
    }, [hierarchyList]);

    const handleChange = (event) => {
        const {target: { value }} = event;
        setPersonName(typeof value === 'string' ? value.split(',') : value);
    };

    const addNewData = (data) => {
        const {name, market_id, application_id, parent_role_id, child_role_id} = data
        let childArr = []
        child_role_id.map((cList) => {
            childArr.push(cList.id)
        })
        let dataObject = {
            application_id: application_id.id,
            market_id: market_id.id,
            parent_role_id: parent_role_id.id,
            child_roles: childArr,
            name: name
        }
        // console.log("dataObject", dataObject)
        // return;
        dispatch(createHierarchy(dataObject));
        setOpen(false);
    };

    useEffect(() => {
        if(createdHierarchy){
            const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
            dispatch(fetchHierarchyList(paginationData));
        }
    }, [createdHierarchy])

    const handleChangeStatus = (status) => {
        if(status.value === true || status.value === false){
            let data = {id: status.id, status: status.row.status}
            dispatch(changeStatus(data));
        }
    }
    const handleSearch = (value) => {
        setSearchData(value);
    };

    const addNew = () => {
        setOpen(true);
    };

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
                    <Grid item xs={6} sm={6} md={8} lg={8}>
                        <Typography sx={StyleSheet.pageTitle} variant="h5" mb={2}>Hierarchy</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4} justifyContent="flex-end">
                        <Box display="flex" justifyContent="flex-end">
                            <CommonButton 
                                variant="contained"
                                onClick={addNew}
                                startIcon = {<AddOutlinedIcon />}
                            >
                                Add Hierarchy
                            </CommonButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <AddHierarchy open={open} onClose={() => setOpen(false)} addNewData={addNewData}/>
            </Box>
            {/* <Box sx={{mt: 5}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormControl sx={{width: '100%' }} variant="outlined">
                            <SearchBar 
                                placeholder="Search for Hierarchy"
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
                                    return <em>Search by: Hierarchy</em>;
                                }
                                return selected.join(', ');
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem disabled value="">
                            <em>Search by: Hierarchy</em>
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
                rows={dataList}
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

export default Hierarchy;