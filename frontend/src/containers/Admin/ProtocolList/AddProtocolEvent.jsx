import React, { useState, useEffect } from 'react'
import CommonModal from '../../../components/CommonModal/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import { FormHelperText } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { fetchActiveVotingMemberList } from '../../../services/Admin/MembersService'; 
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';

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

const defaultInputValues = {
    event_date_time: '',
    member_id: '',
};

const AddProtocolEvent = ({ open, onClose, addNewData, title, protocolDetails }) => {
    const dispatch = useDispatch();
    const [values, setValues] = useState(defaultInputValues);
    const [showPassword, setShowPassword] = React.useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [dateTime, setDateTime] = useState(dayjs('YYYY-MM-DD h:mm A'));

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

    const { activeVotingMemberList, loading, error } = useSelector((state) => ({
        error: state.member.error,
        activeVotingMemberList: state.member.activeVotingMemberList,
        loading: state.member.loading,
      }));
      const activeVotingMemberListArr = [];
      if (activeVotingMemberList && activeVotingMemberList.length > 0) {
        activeVotingMemberList.map((mList, index) => {
          let objectData = {
            id: mList.id,
            name: mList.name,
          };
          activeVotingMemberListArr.push(objectData);
        });
      }
    
      useEffect(() => {
        dispatch(fetchActiveVotingMemberList());
      }, [dispatch]);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const validationSchema = Yup.object().shape({
        // event_date_time: Yup.string().required('Event Date and Time is required'),
        // email: Yup.string().required('Email is required').email('Email is invalid.'),
        // phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        // password: Yup.string().required('Password is required'),
        // user_type: Yup.string().required('User Type is required')
        
    });

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(validationSchema)});
    // console.log('errors', errors)
    const addNew = (data) => {
        console.log('dateTime', dateTime)
        console.log('values', values)
        return
        addNewData(data);
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
                placeholder="Enter Event date and Time"
                name="event_date_time"
                label="Enter Event date and Time"
                required
                {...register('event_date_time')}
                error={errors.event_date_time ? true : false}
                helperText={errors.event_date_time?.message}
                value={values.event_date_time}
                onChange={(event) => handleChange({ ...values, event_date_time: event.target.value })}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker 
                        label="Select Event date and Time"
                        // value={dateTime}
                        onChange={(newValue) => setDateTime(dayjs(newValue))}
                        // onChange={(event, newValue) => {
                        //     console.log("event_date_time ", newValue);
                        //     // handleChange({ ...values, event_date_time: dayjs(newValue).format('YYYY-MM-DD h:mm A')});
                        // }}
                        // onChange={(event, newValue) => {
                        //     handleChange({ ...values, event_date_time: dayjs(newValue).format('YYYY-MM-DD h:mm A')});
                        // }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </DemoContainer>
            </LocalizationProvider> */}
            <Autocomplete
                multiple
                fullWidth
                disableCloseOnSelect
                value={selectedMembers}
                onChange = {(event, newValue) => {setSelectedMembers(newValue); handleChange({ ...values, member_id: newValue })}}
                id="checkboxes-tags-demo"
                options={activeVotingMemberListArr}
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
                        name={"member_id"}
                        label={"Select Members"}
                        placeholder={"Select Members"}
                        error={errors.member_id ? true : false}
                        helperText={errors.member_id?.message}
                        required
                    />
                )}
            />
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={title}
            subTitle={protocolDetails?.protocolId + "("+protocolDetails?.researchType+")"}
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddProtocolEvent