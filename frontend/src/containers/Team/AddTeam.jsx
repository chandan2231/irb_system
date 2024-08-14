import React, { useState, useEffect } from 'react'
import CommonModal from '../../components/CommonModal/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import {TextField, Box} from '@mui/material';
import { fetchActiveMarketList } from "../../services/Market/MarketService";
import { fetchActiveApplicationList } from "../../services/Application/ApplicationService";
// import { fetchActiveRoleList } from '../../services/UserManagement/RoleService';
import { fetchActiveUsersList } from '../../services/UserManagement/UserService';
import { useDispatch, useSelector } from "react-redux";
// import AutoCompleteDropdown from '../../components/AutoCompleteDropdown';
import DropdownWithSearch from '../../components/DropdownWithSearch';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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



const AddTeam = ({ open, onClose, addNewData }) => {
    const dispatch = useDispatch();
    
    const [personName, setPersonName] = React.useState([]);
    const { activeMarketList, loading, error } = useSelector(
        state => ({
            error: state.market.error,
            activeMarketList: state.market.activeMarketList,
            loading: state.market.loading
        })
    );
    const activeMarketListArr = []
    if(activeMarketList && activeMarketList.length > 0) {
        activeMarketList.map((mList, index) => {
            let objectData = {
                id: mList.id,
                name:  mList.name,
            }
            activeMarketListArr.push(objectData)
        })
    }
    
    useEffect(() => {
        dispatch(fetchActiveMarketList());
    }, [dispatch]);

    const defaultInputValues = {
        name: '',
        description: '',
        owner_id: '',
        member_id: '',
        market_id: activeMarketListArr[0],
        application_id: '',
        
    };
    const [values, setValues] = useState(defaultInputValues);
    const { activeApplicationList, loadingApplication, errorApplication } = useSelector(
        state => ({
            errorApplication: state.application.errorApplication,
            activeApplicationList: state.application.activeApplicationList,
            loadingApplication: state.application.loadingApplication
        })
    );
    const activeApplicationListArr = []
    if(activeApplicationList && activeApplicationList.length > 0) {
        activeApplicationList.map((aList, index) => {
            let objectData = {
                id: aList.id,
                name:  aList.name,
            }
            activeApplicationListArr.push(objectData)
        })
    }
    useEffect(() => {
        dispatch(fetchActiveApplicationList());
    }, [dispatch]);

    const { userActiveList, loadingActiveUser, errorActiveUser } = useSelector(
        state => ({
            errorActiveUser: state.user.errorActiveUser,
            userActiveList: state.user.userActiveList,
            loadingActiveUser: state.user.loadingActiveUser
        })
    );
    const activeUsersListArr = []
    if(userActiveList && userActiveList.length > 0) {
        userActiveList.map((uList, index) => {
            let objectData = {
                id: uList.id,
                name:  uList.name,
            }
            activeUsersListArr.push(objectData)
        })
    }
    useEffect(() => {
        dispatch(fetchActiveUsersList());
    }, [dispatch]);


    const modalStyles = {
        inputFields: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginBottom: '15px',
            '.MuiFormControl-root': {
                marginBottom: '20px',
            },
        },
    };

    const handleUserChange = (event) => {
        const {target: { value }} = event;
        setPersonName(typeof value === 'string' ? value.split(',') : value);
    };

    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        // owner_id: Yup.string().required('Owner is required'),
        // member_id: Yup.string().required('Member is required'),
        // market_id: Yup.string().required('Market is required'),
        // application_id: Yup.string().required('Application is required'),
        
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const addNew = (data) => {
        addNewData(values);
    };

    const handleChange = (value) => {
        setValues(value)
    };
    //console.log("valuesvaluesvalues", values)
    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])

    const [selectedOwner, setSelectedOwner] = useState();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState();
    const [selectedApplication, setSelectedApplication] = useState();
    
    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <TextField
                placeholder="Name"
                name="name"
                label="Name"
                required
                {...register('name')}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                value={values.name}
                onChange={(event) => handleChange({ ...values, name: event.target.value })}
            />
            <TextField
                placeholder="Description"
                name="description"
                label="Description"
                required
                {...register('description')}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                value={values.description}
                onChange={(event) => handleChange({ ...values, description: event.target.value })}
            />

            <Autocomplete
                fullWidth
                value={selectedMarket}
                onChange = {(event, newValue) => {setSelectedMarket(newValue); handleChange({ ...values, market_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeMarketListArr}
                defaultValue={ activeMarketListArr[0]}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'market_id'}
                        label={'Select Market'} 
                        placeholder={'Select Market'} 
                        error={errors.market_id ? true : false}
                        helperText={errors.market_id?.message}
                        required
                    />
                )}
            />

            <Autocomplete
                fullWidth
                value={selectedApplication}
                onChange = {(event, newValue) => {setSelectedApplication(newValue); handleChange({ ...values, application_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeApplicationListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'application_id'}
                        label={'Select Application'} 
                        placeholder={'Select Application'} 
                        error={errors.application_id ? true : false}
                        helperText={errors.application_id?.message}
                        required
                    />
                )}
            />

            <Autocomplete
                fullWidth
                value={selectedOwner}
                onChange = {(event, newValue) => {setSelectedOwner(newValue); handleChange({ ...values, owner_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeUsersListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'owner_id'}
                        label={'Select Owner'} 
                        placeholder={'Select Owner'} 
                        error={errors.owner_id ? true : false}
                        helperText={errors.owner_id?.message}
                        required
                    />
                )}
            />

            <Autocomplete
                multiple
                fullWidth
                disableCloseOnSelect
                value={selectedMembers}
                onChange = {(event, newValue) => {setSelectedMembers(newValue); handleChange({ ...values, member_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeUsersListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'member_id'}
                        label={'Select Members'} 
                        placeholder={'Select Members'} 
                        error={errors.member_id ? true : false}
                        helperText={errors.member_id?.message}
                        required

                    />
                )}
            />

            {/*<DropdownWithSearch 
                title={'Select Owner'}
                name={'owner_id'}
                label={'Select Owner *'}
                error={errors.owner_id ? true : false}
                helperText={errors.owner_id?.message}
                value={values.owner_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeUsersListArr}
                setOption={(id) => handleChange({ ...values, owner_id: id })}
                multiple={false}
                {...register("owner_id")}
            />

            <DropdownWithSearch 
                title={'Select Market'}
                name={'market_id'}
                label={'Select Market *'}
                error={errors.market_id ? true : false}
                helperText={errors.market_id?.message}
                value={values.market_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeMarketListArr}
                setOption={(id) => handleChange({ ...values, market_id: id })}
                multiple={false}
                {...register("market_id")}
            />

            <DropdownWithSearch 
                title={'Select Application'}
                name={'application_id'}
                label={'Select Application *'}
                error={errors.application_id ? true : false}
                helperText={errors.application_id?.message}
                value={values.application_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeApplicationListArr}
                setOption={(id) => handleChange({ ...values, application_id: id })}
                multiple={false}
                {...register("application_id")}
            />

            <Autocomplete
                fullWidth
                value={selectedOwner}
                onChange = {(event, newValue) => {setSelectedOwner(newValue); handleChange({ ...values, owner_id: newValue.id })}}
                id="checkboxes-tags-demo"
                options={activeUsersListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'owner_id'}
                        label={'Select Owner'} 
                        placeholder={'Select Owner'} 
                        error={errors.owner_id ? true : false}
                        helperText={errors.owner_id?.message}
                        required
                    />
                )}
            /> */}

            {/* <Autocomplete
                fullWidth
                value={selectedMarket}
                onChange = {(event, newValue) => {setSelectedMarket(newValue); handleChange({ ...values, market_id: newValue.id })}}
                id="checkboxes-tags-demo"
                options={activeMarketListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'market_id'}
                        label={'Select Market'} 
                        placeholder={'Select Market'} 
                        error={errors.market_id ? true : false}
                        helperText={errors.market_id?.message}
                        required
                    />
                )}
            /> */}

            {/* <Autocomplete
                fullWidth
                value={selectedApplication}
                onChange = {(event, newValue) => {setSelectedApplication(newValue); handleChange({ ...values, application_id: newValue.id })}}
                id="checkboxes-tags-demo"
                options={activeApplicationListArr}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        name={'application_id'}
                        label={'Select Application'} 
                        placeholder={'Select Application'} 
                        error={errors.application_id ? true : false}
                        helperText={errors.application_id?.message}
                        required
                    />
                )}
            /> */}

            
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Create New Team"
            subTitle=""
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddTeam