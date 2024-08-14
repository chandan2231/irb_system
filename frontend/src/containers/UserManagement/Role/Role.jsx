import * as React from 'react';
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CommonButton from '../../../components/CommonButton';
import AddRole from './AddRole';
import moment from "moment";
import ToggleStatus from '../../../components/ToggleStatus';
import { fetchRoleList, createRole, changeStatus } from "../../../services/UserManagement/RoleService";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
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



function Role(){
    const theme = useTheme();
    const dispatch = useDispatch();
    const [personName, setPersonName] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [open, setOpen] = useState(false);
    const [markets, setMarkets] = useState([]);
    const [roleDataList, setRoleDataList] = useState([]);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 5,
    });
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
            field: 'description', 
            headerName: 'Description', 
            flex: 1,
        },
        { 
            field: 'market', 
            headerName: 'Market', 
            flex: 1,
        },
        
        { 
            field: 'application', 
            headerName: 'Application', 
            flex: 1,
        },
        { 
            field: 'privileges', 
            headerName: 'Privilege', 
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
    const { roleList, loading, error, createdRole } = useSelector(
        state => ({
            error: state.role.error,
            roleList: state.role.roleList,
            loading: state.role.loading,
            createdRole: state.role.createdRole
        })
    );
    useEffect(() => {
        const data = { page: paginationModel.page, size: paginationModel.pageSize };
        dispatch(fetchRoleList(data));
    }, [dispatch, paginationModel.page, paginationModel.pageSize]);

    if(roleList !== '' && roleList?.content?.length > 0){
        totalElements = roleList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    useEffect(() => {
        const rListArr = []
        if(roleList && roleList?.content?.length > 0) {
            roleList.content.map((rList, index) => {
                let memberCount = (Number(rList?.privileges?.length) - 1) 
                let objectData = {
                    id: rList.id,
                    name: rList.name,
                    description: rList.description,
                    market: rList.market?.name,
                    privileges:  memberCount === 0 ? rList.privileges[0]?.name : (rList.privileges[0]?.name+' + '+memberCount),
                    application:  rList.application?.name,
                    status:  rList.enabled,
                    createdDate: moment(rList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(rList.updated_at).format("DD-MM-YYYY"),
                }
                rListArr.push(objectData)
            })
            setRoleDataList(rListArr)
        }
    }, [roleList]);

    const addNewData = (data) => {
        const {application_id, description, market_id, name, previlege_id} = data
        let previlegeArr = []
        previlege_id.map((pList) => {
            previlegeArr.push(pList.id)
        })
        let dataObject = {
            name: name,
            description: description,
            application_id: application_id.id,
            market_id: market_id.id,
            privileges: previlegeArr
        }
        // console.log("dataObject", dataObject)
        // return;
        dispatch(createRole(dataObject));
        setOpen(false);
    };

    useEffect(() => {
        if(createdRole){
            const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
            dispatch(fetchRoleList(paginationData));
        }
    }, [createdRole])

    const handleChangeStatus = (status) => {
        if(status.value === true || status.value === false){
            let data = {id: status.id, status: status.row.status}
            dispatch(changeStatus(data));
        }
    }
    
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
                    <Grid item xs={5} sm={5} md={8} lg={8}>
                        <Typography variant="h5" mb={2}>Role</Typography>
                    </Grid>
                    <Grid item xs={7} sm={7} md={4} lg={4}>
                        <Box display="flex" justifyContent="flex-end">
                            <CommonButton 
                                variant="contained"
                                onClick={addNew}
                                startIcon = {<AddOutlinedIcon />}
                            >
                                Add Role
                            </CommonButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <AddRole open={open} onClose={() => setOpen(false)} addNewData={addNewData}/>
            </Box>
            {/* <Box sx={{mt: 5}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormControl sx={{width: '100%' }} variant="outlined">
                            <SearchBar 
                                placeholder="Search for Role"
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
                                    return <em>Search by: Role</em>;
                                }
                                return selected.join(', ');
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem disabled value="">
                            <em>Search by: Role</em>
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
                    <Grid item xs={6} sm={6} md={1} lg={1}>
                        <Box justifyContent="flex-end" display={{ xs: 'block', md: 'flex' }}>
                            <Button variant="outlined" startIcon={<CloseOutlinedIcon />} size="large" style={{lineHeight: '2.4375em'}}>
                                Reset
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box> */}
            <Box sx={{mt: 5}}>
            <DataGrid
                rows={roleDataList}
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

export default Role;