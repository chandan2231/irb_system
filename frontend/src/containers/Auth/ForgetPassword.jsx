import { useDispatch, useSelector } from 'react-redux'
import { sendUsername } from '../../services/Auth/AuthService'
import { Box, Typography, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import FormControl from '@mui/material/FormControl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import { useSearchParams, useNavigate } from 'react-router-dom'

const defaultInputValues = {
  username: ''
}

function ForgetPassword() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [values, setValues] = useState(defaultInputValues)
  const [successMessage, setSuccessMessage] = React.useState('')
  let [searchParams, setSearchParams] = useSearchParams()

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) })
  // console.log('errors', errors)
  const onSubmit = (data) => {
    let dataObject = {}
    dataObject.username = data.username
    dataObject.redirect_url = searchParams.get('redirect_url')
    dispatch(sendUsername(dataObject)).then((data) => {
      // console.log("send username response", data)
      if (data.payload.status) {
        setSuccessMessage(true)
      } else {
        setSuccessMessage(false)
      }
    })
  }

  const handleChange = (value) => {
    setValues(value)
  }

  // useEffect(() => {
  //     if(loading){
  //         const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
  //         dispatch(fetchMarketList(paginationData));
  //     }
  // }, [loading])

  const styles = {
    title: {
      paddingTop: '50px',
      paddingBottom: '10px',
      display: 'flex',
      top: '50%',
      left: '50%',
      margin: 'auto'
    },
    buttonStyle: {
      margin: '0 auto',
      display: 'flex',
      marginTop: '25px'
    }
  }

  return (
    <Box m={theme.layoutContainer.layoutSection}>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Card sx={{ minWidth: 500 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                {successMessage === true ? (
                  <Typography sx={{ mt: 2, mb: 5 }}>
                    <h4 sx={styles.title} className="success_msg">
                      You will get and email to reset your password
                    </h4>
                  </Typography>
                ) : successMessage === false ? (
                  <Typography sx={{ mt: 2, mb: 5 }}>
                    <h4 sx={styles.title} className="error_msg">
                      Something went wrong
                    </h4>
                  </Typography>
                ) : (
                  <></>
                )}
                <Typography sx={{ mt: 2, mb: 5 }}>
                  <h2 sx={styles.title}>Forget Password</h2>
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    placeholder="Username"
                    name="username"
                    label="Username"
                    {...register('username')}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                    value={values.username}
                    onChange={(event) =>
                      handleChange({ ...values, username: event.target.value })
                    }
                  />
                </FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={styles.buttonStyle}
                >
                  Submit
                </Button>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Box>
    </Box>
  )
}

export default ForgetPassword
