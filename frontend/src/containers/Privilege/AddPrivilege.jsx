import React, { useState, useEffect } from 'react'
import CommonModal from '../../components/CommonModal/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import { TextField, Box } from '@mui/material';
import { fetchActiveMarketList } from "../../services/Market/MarketService";
import { fetchActiveApplicationList } from "../../services/Application/ApplicationService";
import { useDispatch, useSelector } from "react-redux";
import DropdownWithSearch from '../../components/DropdownWithSearch';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



const AddPrivilege = ({ open, onClose, addNewData }) => {
    const dispatch = useDispatch();
    const { activeMarketList, loading, error } = useSelector(
        state => ({
            error: state.market.error,
            activeMarketList: state.market.activeMarketList,
            loading: state.market.loading
        })
    );

    useEffect(() => {
        dispatch(fetchActiveMarketList());
    }, [dispatch]);

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
    const defaultInputValues = {
        name: '',
        description: '',
        market_id: activeMarketListArr[0],
        application_id: '',
    };
    const [values, setValues] = useState(defaultInputValues);
    const [selectedMarket, setSelectedMarket] = useState();
    const [selectedApplication, setSelectedApplication] = useState();

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
        description: Yup.string().required('Description is required'),
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
        setValues({...values, ['market_id']: activeMarketListArr[0]})
        addNewData(values);
    };

    const handleChange = (value) => {
        setValues(value)
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

            
            {/* <DropdownWithSearch 
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
                {...register("application_id")}
            /> */}
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Create New Privilege"
            subTitle=""
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddPrivilege