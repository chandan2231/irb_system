import React, { useState, useEffect } from 'react'
import CommonModal from '../../components/CommonModal/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import {TextField, Box} from '@mui/material';
import { fetchActiveMarketList } from "../../services/Market/MarketService";
import { fetchActiveApplicationList } from "../../services/Application/ApplicationService";
import { fetchActiveRoleList } from '../../services/UserManagement/RoleService';
// import { fetchActiveUsersList } from '../../services/UserManagement/UserService';
import DropdownWithSearch from '../../components/DropdownWithSearch';
import { useDispatch, useSelector } from "react-redux";
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



const AddHierarchy = ({ open, onClose, addNewData }) => {
    const dispatch = useDispatch();
    const [selectedParentRole, setSelectedParentRole] = useState();
    const [selectedChildMembers, setSelectedChildMembers] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState();
    const [selectedApplication, setSelectedApplication] = useState();
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
        name: '',
        market_id: activeMarketListArr[0],
        // parent_role_id: '',
        // child_role_id: '',
        // application_id: '',
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
        name: Yup.string().required('Name is required'),
        // parent_role_id: Yup.string().required('Parent Role is required'),
        // market_id: Yup.string().required('Market is required'),
        // application_id: Yup.string().required('Application is required'),
        // child_role_id: Yup.string().required('Child Role is required'),
        
        
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
        if(value?.application_id.id !== '' && (seletedApplicationId !== value?.application_id.id)){
            setSelectedParentRole()
            setSelectedChildMembers([])
            setSeletedApplicationId(value?.application_id.id)
        } else if (value?.application_id.id !== '') {
            setSeletedApplicationId(value?.application_id.id)
        }
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])

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
            <Autocomplete
                fullWidth
                value={selectedMarket}
                onChange = {(event, newValue) => {setSelectedMarket(newValue); handleChange({ ...values, market_id: newValue })}}
                id="checkboxes-tags-demo"
                defaultValue={ activeMarketListArr[0]}
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
                value={selectedParentRole}
                onChange = {(event, newValue) => {setSelectedParentRole(newValue); handleChange({ ...values, parent_role_id: newValue })}}
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
                        name={'parent_role_id'}
                        label={'Select Parent Role'} 
                        placeholder={'Select Parent Role'} 
                        error={errors.parent_role_id ? true : false}
                        helperText={errors.parent_role_id?.message}
                        required
                    />
                )}
            />
            
            <Autocomplete
                fullWidth
                multiple
                value={selectedChildMembers}
                onChange = {(event, newValue) => {setSelectedChildMembers(newValue); handleChange({ ...values, child_role_id: newValue })}}
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
                        name={'child_role_id'}
                        label={'Select Child Role'} 
                        placeholder={'Select Child Role'} 
                        error={errors.child_role_id ? true : false}
                        helperText={errors.child_role_id?.message}
                        required
                    />
                )}
            />
            {/* <DropdownWithSearch 
                title={'Parent Role'}
                name={'parent_role_id'}
                label={'Parent Role *'}
                error={errors.parent_role_id ? true : false}
                helperText={errors.parent_role_id?.message}
                value={values.parent_role_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeRoleListArr}
                setOption={(id) => handleChange({ ...values, parent_role_id: id })}
                multiple={false}
                {...register("parent_role_id")}
            />
            <DropdownWithSearch 
                title={'Child Role'}
                name={'child_role_id'}
                label={'Child Role *'}
                error={errors.child_role_id ? true : false}
                helperText={errors.child_role_id?.message}
                value={values.child_role_id}
                labelId={"demo-simple-select-required-label"}
                id={"demo-simple-select-required"}
                activeListArr = {activeRoleListArr}
                setOption={(id) => handleChange({ ...values, child_role_id: id })}
                multiple={false}
                {...register("child_role_id")}
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
            />*/}
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Create New Hierarchy"
            subTitle=""
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddHierarchy