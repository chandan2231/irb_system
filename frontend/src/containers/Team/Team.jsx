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
import SearchBar from '../../components/SearchBar/SearchBar';
import CommonButton from '../../components/CommonButton';
import AddTeam from './AddTeam';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import { fetchTeamList, createTeam, changeStatus } from '../../services/Team/TeamService';
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



function Team(){
    const theme = useTheme();
    const dispatch = useDispatch();
    const [personName, setPersonName] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = React.useState([]);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 5,
    });
    var totalElements = 0;
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
            field: 'owner', 
            headerName: 'Owner', 
            flex: 1
        },
        { 
            field: 'members', 
            headerName: 'Members', 
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
    const { teamList, loading, error, createdTeam } = useSelector(
        state => ({
            error: state.team.error,
            teamList: state.team.teamList,
            loading: state.team.loading,
            createdTeam: state.team.createdTeam
        })
    );
    useEffect(() => {
        const data = { page: paginationModel.page, size: paginationModel.pageSize };
        dispatch(fetchTeamList(data));
    }, [dispatch, paginationModel.page, paginationModel.pageSize]);

    if(teamList !== '' && teamList?.content?.length > 0){
        totalElements = teamList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    useEffect(() => {
        const teamListArr = []
        if(teamList && teamList?.content?.length > 0) {
            
            teamList.content.map((tList, index) => {
                let memberCount = (Number(tList?.members?.length) - 1) 

                let applicationObject = {
                    id: tList.id,
                    name:  tList.name,
                    owner:  tList.owner?.name,
                    members:  memberCount === 0 ? tList.members[0]?.name : (tList.members[0]?.name+' + '+memberCount),
                    market:  tList.market?.name,
                    application:  tList.application?.name,
                    status:  tList.enabled,
                    createdDate: moment(tList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(tList.updated_at).format("DD-MM-YYYY"),
                }
                teamListArr.push(applicationObject)
            })
            setDataList(teamListArr)
        }
    }, [teamList]);

    const addNewData = (data) => {
        const {name, description, owner_id, member_id, market_id, application_id} = data
        let membersArr = []
        member_id.map((mList) => {
            membersArr.push(mList.id)
        })
        let dataObject = {
            name: name,
            description: description,
            owner: owner_id.id,
            members: membersArr,
            application_id: application_id.id,
            market_id: market_id.id
        }
        // console.log("dataObject", dataObject)
        // return;
        dispatch(createTeam(dataObject));
        setOpen(false);
    };

    useEffect(() => {
        if(createdTeam){
            const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
            dispatch(fetchTeamList(paginationData));
        }
    }, [createdTeam])

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
                    <Grid item xs={6} sm={6} md={8} lg={8}>
                        <Typography sx={StyleSheet.pageTitle} variant="h5" mb={2}>Team</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4} justifyContent="flex-end">
                        <Box display="flex" justifyContent="flex-end">
                            <CommonButton 
                                variant="contained"
                                onClick={addNew}
                                startIcon = {<AddOutlinedIcon />}
                            >
                                Add Team
                            </CommonButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <AddTeam open={open} onClose={() => setOpen(false)} addNewData={addNewData}/>
            </Box>
            {/* <Box sx={{mt: 5}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormControl sx={{width: '100%' }} variant="outlined">
                            <SearchBar 
                                placeholder="Search for Team"
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
                                    return <em>Search by: Team</em>;
                                }
                                return selected.join(', ');
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem disabled value="">
                            <em>Search by: Team</em>
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

export default Team;