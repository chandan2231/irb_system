import React, { useState, useEffect } from 'react'
import CommonModal from '../../../components/CommonModal/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import { fetchActiveMarketList } from "../../../services/Market/MarketService";
import { fetchActiveApplicationList } from "../../../services/Application/ApplicationService";
import { fetchActiveUsersList } from '../../../services/UserManagement/UserService';
import { fetchActiveRoleList } from '../../../services/UserManagement/RoleService';
import { useDispatch, useSelector } from "react-redux";
import DropdownWithSearch from '../../../components/DropdownWithSearch';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {TextField, Box} from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



const AddUserApplicationRole = ({ open, onClose, addNewData }) => {
    const dispatch = useDispatch();
    const [selectedMarket, setSelectedMarket] = useState();
    const [selectedApplication, setSelectedApplication] = useState();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [seletedApplicationId, setSeletedApplicationId] = useState('');
    
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
        market_id: activeMarketListArr[0],
        // user_id: '',
        // application_id: '',
        // role_id: '',
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

    const { roleActiveList, loadingActiveRole, errorActiveRole } = useSelector(
        state => ({
            errorActiveRole: state.role.errorActiveRole,
            roleActiveList: state.role.roleActiveList,
            loadingActiveRole: state.role.loadingActiveRole
        })
    );
    const activeRoleListArr = []
    if(roleActiveList && roleActiveList.length > 0) {
        roleActiveList.map((uList, index) => {
            let objectData = {
                id: uList.id,
                name:  uList.name,
            }
            activeRoleListArr.push(objectData)
        })
    }
    useEffect(() => {
        if(seletedApplicationId !== ''){
            dispatch(fetchActiveRoleList(seletedApplicationId));
        }
    }, [dispatch, seletedApplicationId]);




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

    
    const validationSchema = Yup.object().shape({
        // user_id: Yup.string().required('User is required'),
        // market_id: Yup.string().required('Market is required'),
        // application_id: Yup.string().required('Application is required'),
        // role_id: Yup.string().required('Role is required')
    });

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(validationSchema)});

    const addNew = (data) => {
        addNewData(values);
    };

    const handleChange = (value) => {
        setValues(value)
        if(value?.application_id.id !== '' && (seletedApplicationId !== value?.application_id.id)){
            setSeletedApplicationId(value?.application_id.id)
            setSelectedRoles([])
        } else if (value?.application_id.id !== '') {
            setSeletedApplicationId(value?.application_id.id)
        }
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <Autocomplete
                fullWidth
                value={selectedUser}
                onChange = {(event, newValue) => {setSelectedUser(newValue); handleChange({ ...values, user_id: newValue })}}
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
                        name={'user_id'}
                        label={'Select User'} 
                        placeholder={'Select User'} 
                        error={errors.user_id ? true : false}
                        helperText={errors.user_id?.message}
                        required
                    />
                )}
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
                multiple
                disableCloseOnSelect
                value={selectedRoles}
                onChange = {(event, newValue) => {setSelectedRoles(newValue); handleChange({ ...values, role_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeRoleListArr}
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
                        name={'role_id'}
                        label={'Select Role'} 
                        placeholder={'Select Role'} 
                        error={errors.role_id ? true : false}
                        helperText={errors.role_id?.message}
                        required
                    />
                )}
            />
            {/*
            
            <DropdownWithSearch 
                title={'Select User'}
                name={'user_id'}
                label={'Select User *'}
                error={errors.user_id ? true : false}
                helperText={errors.user_id?.message}
                value={values.user_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeUsersListArr}
                setOption={(id) => handleChange({ ...values, user_id: id })}
                multiple={false}
                {...register("user_id")}
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
            
            <DropdownWithSearch 
                title={'Select Role'}
                name={'role_id'}
                label={'Select Role *'}
                error={errors.role_id ? true : false}
                helperText={errors.role_id?.message}
                value={values.role_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeRoleListArr}
                setOption={(id) => handleChange({ ...values, role_id: id })}
                multiple={false}
                {...register("role_id")}
            /> */}
            
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Create New User Application Role"
            subTitle=""
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddUserApplicationRole
