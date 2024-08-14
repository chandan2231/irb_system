import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketList, createMarket, changeStatus } from "../../services/Market/MarketService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchBar from "../../components/SearchBar/SearchBar";
import CommonButton from "../../components/CommonButton";
import AddMarket from "./AddMarket";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
    
const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

function Market() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [personName, setPersonName] = React.useState([]);
    const [searchData, setSearchData] = React.useState();
    const [marketDataList, setMarketDataList] = React.useState([]);
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = React.useState({page: 0,  pageSize: 5});
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            renderCell: (params) => <a href={`/market-details/`}>{params.value}</a>,
        },
        {
            field: "code",
            headerName: "Code",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <ToggleStatus status={params.row.status}  />
            )
        },
        {
            field: "createdDate",
            headerName: "Created Date",
            flex: 1,
        },
        {
            field: "updatedDate",
            headerName: "Updated Date",
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
    const { marketList, loading, error, createdMarket } = useSelector(
        state => ({
            error: state.market.error,
            marketList: state.market.marketList,
            loading: state.market.loading,
            createdMarket: state.market.createdMarket
        })
    );
    useEffect(() => {
        const data = { page: paginationModel.page, size: paginationModel.pageSize };
        dispatch(fetchMarketList(data));
    }, [dispatch, paginationModel.page, paginationModel.pageSize]);

    if(marketList !== '' && marketList?.content?.length > 0){
        totalElements = marketList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    const addNew = () => {
        setOpen(true);
    };

    useEffect(() => {
        const mListArr = []
        if(marketList && marketList?.content?.length > 0) {
            marketList.content.map((mList, index) => {
            let marketObject = {
                    id: mList.id,
                    name:  mList.name,
                    code:  mList.code,
                    status:  mList.enabled,
                    createdDate: moment(mList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(mList.updated_at).format("DD-MM-YYYY"),
                }
                mListArr.push(marketObject)
            })
            setMarketDataList(mListArr)
        }
    }, [marketList]);
    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(typeof value === "string" ? value.split(",") : value);
    };
    const handleSearch = (value) => {
        setSearchData(value);
    };
    const addNewData = (data) => {
        dispatch(createMarket(data));
        setOpen(false);
    };
    
    useEffect(() => {
        if(createdMarket){
            const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
            dispatch(fetchMarketList(paginationData));
        }
    }, [createdMarket])

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
    return (
        <Box m={theme.layoutContainer.layoutSection}>
        <Box>
            <Grid container spacing={2}>
            <Grid item xs={5} sm={5} md={8} lg={8}>
                <Typography variant="h5" mb={2}>
                Market
                </Typography>
            </Grid>
            <Grid item xs={7} sm={7} md={4} lg={4}>
                <Box display="flex" justifyContent="flex-end">
                <CommonButton
                    variant="contained"
                    onClick={addNew}
                    startIcon={<AddOutlinedIcon />}
                >
                    Add Market
                </CommonButton>
                </Box>
            </Grid>
            </Grid>
        </Box>
        <Box>
            <AddMarket
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
            />
        </Box>
        {/* <Box sx={{ mt: 5 }}>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                <SearchBar
                    placeholder="Search for market"
                    onChange={(event) => handleSearch(event.target.value)}
                    searchBarWidth="100%"
                />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={5} lg={5}>
                <FormControl sx={{ width: "100%" }}>
                <Select
                    displayEmpty
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>Search by: Market</em>;
                    }
                    return selected.join(", ");
                    }}
                    inputProps={{ "aria-label": "Without label" }}
                >
                    <MenuItem disabled value="">
                    <em>Search by: Market</em>
                    </MenuItem>
                    {names.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={1} lg={1}>
                <Box
                justifyContent="flex-end"
                display={{ xs: "block", md: "flex" }}
                >
                <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    size="large"
                    style={{ lineHeight: "2.4375em" }}
                >
                    Reset
                </Button>
                </Box>
            </Grid>
            </Grid>
        </Box> */}
        <Box sx={{ mt: 5 }}>
        <DataGrid
            rows={marketDataList}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            pageSizeOptions={[5]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            onCellClick={(param) => handleChangeStatus(param)}
            // onRowClick={(param) => handleChangeStatus(param)}
        />
        </Box>
        </Box>
    );
    }

    export default Market;
