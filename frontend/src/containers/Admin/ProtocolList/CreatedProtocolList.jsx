import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCreatedProtocolList,
  allowProtocolWaiveFee
} from '../../../services/Admin/ProtocolListService'
import { Box, Typography, useTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useNavigate } from 'react-router-dom'
import { protocolReport } from '../../../services/UserManagement/UserService'
import ToggleStatus from '../../../components/ToggleStatus'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function CreatedProtocolList() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [protocolDataList, setProtocolDataList] = React.useState([])
  const [user, setUser] = useState([])
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'))
    if (userDetails) {
      setUser(userDetails)
    }
  }, [])
  const navigateProtocolDetails = (params) => {
    navigate('/admin/protocol-details', { state: { details: params.row } })
  }
  const columns = [
    {
      field: 'protocolId',
      headerName: 'Protocol Number',
      flex: 1,
      renderCell: (params) => (
        <a className="link-tag" onClick={() => navigateProtocolDetails(params)}>
          {params.value}
        </a>
      )
    },
    {
      field: 'researchType',
      headerName: 'Research Type',
      flex: 1
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'waiveFee',
      headerName: 'Waive Fee',
      flex: 1,
      renderCell: (params) => <ToggleStatus status={params.row.waiveFee} />
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
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
          icon={<PictureAsPdfIcon />}
          label="View Pdf"
          onClick={() => handleViewPdf(params)}
          showInMenu
        />
        // <GridActionsCellItem
        //     icon={<RadioButtonUncheckedIcon />}
        //     label="Change Status"
        //     onClick={handleChangeStatus(params)}
        //     showInMenu
        // />,
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
        // <GridActionsCellItem
        //     icon={<DeleteIcon />}
        //     label="Delete"
        //     onClick={handleItemDelete(params)}
        //     showInMenu
        // />,
      ]
    }
  ]

  var totalElements = 0
  const { createdProtocolList, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    createdProtocolList: state.admin.createdProtocolList,
    loading: state.admin.loading
  }))
  useEffect(() => {
    dispatch(fetchCreatedProtocolList())
  }, [dispatch, user.id])
  if (createdProtocolList !== '' && createdProtocolList?.length > 0) {
    totalElements = createdProtocolList.length
  }
  const rowCountRef = React.useRef(totalElements || 0)
  const rowCount = React.useMemo(() => {
    if (totalElements !== undefined) {
      rowCountRef.current = totalElements
    }
    return rowCountRef.current
  }, [totalElements])

  useEffect(() => {
    const pListArr = []
    if (createdProtocolList && createdProtocolList?.length > 0) {
      createdProtocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          username: pList.name,
          email: pList.email,
          waiveFee: pList.waive_fee,
          status:
            pList.status === '1'
              ? 'Created'
              : pList.status === '2'
                ? 'Under Review'
                : pList.status === '3'
                  ? 'Approved'
                  : 'Rejected',
          createdDate: moment(pList.created_at).format('DD-MM-YYYY'),
          updatedDate: moment(pList.updated_at).format('DD-MM-YYYY')
        }
        pListArr.push(protocolObject)
      })
      setProtocolDataList(pListArr)
    }
  }, [createdProtocolList])

  const handleViewPdf = async (params) => {
    const { row } = params
    const { protocolId, researchType } = row
    const protocolReportPayload = {
      protocolId: protocolId,
      protocolType: researchType
    }
    let pdfResponse = await protocolReport(protocolReportPayload)
    if (pdfResponse !== '') {
      window.open(pdfResponse.pdfUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // console.log('protocolList', protocolList)

  const handleChangeStatus = (status) => {
    // console.log('status', status)
    // return
    if (status.row.waiveFee === 1 || status.row.waiveFee === 2) {
      let waiveFeevalue = ''
      if (status.row.waiveFee === 1) {
        waiveFeevalue = 2
      } else if (status.row.waiveFee === 2) {
        waiveFeevalue = 1
      }
      let data = { id: status.id, waive_fee: waiveFeevalue }
      dispatch(allowProtocolWaiveFee(data)).then((data) => {
        console.log('data', data)
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
  // const handleItemDelete = (params) => {
  //     //console.log('Delete Item', params)
  // }

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
                Created Protocol List
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={protocolDataList}
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

export default CreatedProtocolList
