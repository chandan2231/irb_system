import React, { useState, useEffect } from "react";
import CommonModal from "../../../components/CommonModal/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormHelperText } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { fetchActiveVotingMemberList,  fetchAssignMemberList} from "../../../services/Admin/MembersService";
import { useDispatch, useSelector } from "react-redux";


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
    event_subject: '',
    event_msg: '',
    member_id: '',
};

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

const AssignProtocolToMember = ({ open, onClose, addAssignedMemberData, title, protocolDetails }) => {
    const dispatch = useDispatch();
    const [values, setValues] = useState(defaultInputValues);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [memberSelectionError, setMemberSelectionError] = useState();

    const { activeVotingMemberList, loading, error, memberAssignedList } = useSelector((state) => ({
        error: state.member.error,
        activeVotingMemberList: state.member.activeVotingMemberList,
        loading: state.member.loading,
        memberAssignedList: state.member.memberAssignedList,
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
        let data = {'protocolId' : protocolDetails?.protocolId}
        dispatch(fetchAssignMemberList(data));
    }, [protocolDetails?.protocolId]);

    useEffect(() => {
        dispatch(fetchActiveVotingMemberList());
    }, [dispatch]);

    const validationSchema = Yup.object().shape({
        // event_subject: Yup.string().required('This is required'),
        // event_msg: Yup.string().required('This is required'),
    });

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(validationSchema)});
    
    const addNew = (data) => {
        if(values.member_id.length <= 0){
            setMemberSelectionError('Member selection is required')
            return
        } else {
            setMemberSelectionError('')
        }
        addAssignedMemberData(values);
    };

    const handleChange = (value) => {
        setValues(value);
    };

    const getContent = () => (
        <>
            <h3>{protocolDetails?.protocolId +' '+"("+protocolDetails?.researchType+")"}</h3>
            <h4>Assigned Members :</h4>
            {
                memberAssignedList !== null && memberAssignedList.data.length > 0 && memberAssignedList.data.map((list, index) => (
                    <span key={index}>
                        {list.name}{index < memberAssignedList.data.length - 1 && ', '}
                    </span>
                ))
            }
            <Box sx={modalStyles.inputFields}>
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
                {memberSelectionError && <span style={{color: 'red'}}>{memberSelectionError}</span>}
            </Box>
        </>
        
    );
    console.log('memberAssignedList', memberAssignedList)
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={title}
            subTitle={''}
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AssignProtocolToMember;
