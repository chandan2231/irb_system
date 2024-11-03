import * as React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CommonButton from '../../../components/CommonButton'
import AddEventPrice from './AddEventPrice'
import moment from 'moment'
import ToggleStatus from '../../../components/ToggleStatus'
import {
  fetchEventPriceList,
  createEventPrice,
  changeStatus
} from '../../../services/Admin/EventPriceService'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import LockResetIcon from '@mui/icons-material/LockReset'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function EventPriceList() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false)
  const [userId, setUserId] = useState()
  const [userDataList, setUserDataList] = useState([])

  const columns = [
    {
      field: 'eventName',
      headerName: 'Event Name',
      flex: 1
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <ToggleStatus status={params.row.status} />
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
          icon={<LockResetIcon />}
          label="Change Password"
          onClick={() => handleChangePassword(params)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleItemDelete(params)}
          showInMenu
        />
        // <GridActionsCellItem
        //     icon={<EditNoteIcon />}
        //     label="Edit"
        //     onClick={handleItemEdit(params)}
        //     showInMenu
        // />,
        // <GridActionsCellItem
        //     icon={<SettingsSuggestIcon />}
        //     label="Details"
        //     onClick={handleItemDetail(params)}
        //     showInMenu
        // />,
      ]
    }
  ]
  var totalElements = 0
  const { eventPriceList, loading, error, eventPriceCreated } = useSelector(
    (state) => ({
      error: state.eventPrice.error,
      eventPriceList: state.eventPrice.eventPriceList,
      loading: state.eventPrice.loading,
      eventPriceCreated: state.eventPrice.eventPriceCreated
    })
  )

  if (eventPriceList !== '' && eventPriceList?.length > 0) {
    totalElements = eventPriceList.totalElements
  }
  const rowCountRef = React.useRef(totalElements || 0)
  const rowCount = React.useMemo(() => {
    if (totalElements !== undefined) {
      rowCountRef.current = totalElements
    }
    return rowCountRef.current
  }, [totalElements])

  useEffect(() => {
    const uListArr = []
    if (eventPriceList && eventPriceList?.length > 0) {
      eventPriceList.map((uList, index) => {
        let listObject = {
          id: uList.id,
          eventName: uList.event_type,
          price: uList.price,
          status: uList.status,
          createdDate: moment(uList.created_date).format('DD-MM-YYYY'),
          updatedDate: moment(uList.updated_date).format('DD-MM-YYYY')
        }
        uListArr.push(listObject)
      })
      setUserDataList(uListArr)
    }
  }, [eventPriceList])

  useEffect(() => {
    dispatch(fetchEventPriceList())
  }, [])

  const addNewData = (data) => {
    dispatch(createEventPrice(data)).then((data) => {
      if (data.payload.status === 200) {
        setOpen(false)
        toast.success(data.payload.data, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        })
        setFo
      } else {
        setOpen(false)
        toast.error(data.payload, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        })
      }
    })
  }

  useEffect(() => {
    if (eventPriceCreated) {
      dispatch(fetchEventPriceList())
    }
  }, [eventPriceCreated])

  const handleChangeStatus = (status) => {
    if (Number(status.value) === 1 || Number(status.value) === 2) {
      let statusValue = ''
      if (Number(status.value) === 1) {
        statusValue = 2
      } else if (Number(status.value) === 2) {
        statusValue = 1
      }
      let data = { id: status.id, status: statusValue }
      dispatch(changeStatus(data)).then((data) => {
        if (data.payload.status === 200) {
          toast.success(data.payload.msg, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
          })
        } else {
          toast.error(data.payload.msg, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
          })
        }
      })
    }
  }

  const addNew = () => {
    setOpen(true)
  }

  const handleChangePassword = (params) => {
    if (params.row.userType) {
      setUserId(params.row.id)
      setPasswordChangeOpen(true)
    }
  }

  const handleItemDelete = (params) => {
    //console.log('Delete Item', params)
  }

  // const handleItemDetail = (params) => {
  //     //console.log('Details Item', params)
  // }

  // const handleItemEdit = (params) => {
  //     //console.log('Edit Item', params)
  // }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Box m={theme.layoutContainer.layoutSection}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={5} sm={5} md={8} lg={8}>
              <Typography variant="h5" mb={2}>
                Event Price List
              </Typography>
            </Grid>
            <Grid item xs={7} sm={7} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                >
                  Add New Event Price
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <AddEventPrice
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
            title="Add Event Price"
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={userDataList}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            onCellClick={(param) => handleChangeStatus(param)}
          />
        </Box>
      </Box>
    </>
  )
}

export default EventPriceList
