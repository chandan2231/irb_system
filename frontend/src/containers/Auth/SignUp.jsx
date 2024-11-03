import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {
  Grid,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  CardActions,
  Button,
  CardHeader,
  FormControl
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField } from 'formik-material-ui'
import { userSignUp } from '../../services/Auth/AuthService'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material'

function SignUp() {
  const navigate = useNavigate()
  const theme = useTheme()
  const dispatch = useDispatch()
  const [err, setErr] = useState(null)
  const [researchTypeError, setResearchTypeError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const initialValues = {
    name: '',
    mobile: '',
    email: '',
    password: '',
    city: '',
    researcherType: ''
  }
  const options = [
    { label: 'Clinical Site', value: 'Clinical Site' },
    { label: 'Multi-Site Sponsor', value: 'Multi-Site Sponsor' },
    { label: 'Principal Investigator', value: 'Principal Investigator' }
  ]
  //password validation
  const lowercaseRegEx = /(?=.*[a-z])/
  const uppercaseRegEx = /(?=.*[A-Z])/
  const numericRegEx = /(?=.*[0-9])/
  const lengthRegEx = /(?=.{6,})/

  let validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    mobile: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .matches(
        lowercaseRegEx,
        'Must contain one lowercase alphabetical character!'
      )
      .matches(
        uppercaseRegEx,
        'Must contain one uppercase alphabetical character!'
      )
      .matches(numericRegEx, 'Must contain one numeric character!')
      .matches(lengthRegEx, 'Must contain 6 characters!')
      .required('Required!'),
    city: Yup.string().required('Required')
  })
  const handleFormSubmit = (values) => {
    const { researcherType } = values
    if (researcherType === '') {
      setResearchTypeError('Required!')
      return
    } else {
      setResearchTypeError('')
      dispatch(userSignUp(values)).then((data) => {
        if (data.payload.status === 200) {
          setSuccessMessage(data.payload.data)
          navigate('/signin')
        } else {
          setSuccessMessage(false)
        }
      })
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={1} className="center-card">
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card>
            <CardHeader title="REGISTER"></CardHeader>
            {successMessage !== '' && (
              <span className="success_msg">{successMessage}</span>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                dirty,
                isValid,
                values,
                handleSubmit,
                handleChange,
                handleBlur
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <CardContent>
                      <p
                        className="error_text"
                        style={{ marginBottom: '15px' }}
                      >
                        {err && err}
                      </p>
                      <Grid item container spacing={1}>
                        <Grid item xs={12} sm={6} md={6}>
                          <Field
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={values.name}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <Field
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            name="mobile"
                            value={values.mobile}
                            component={TextField}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          style={{ marginTop: '15px' }}
                        >
                          <Field
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={values.email}
                            component={TextField}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          style={{ marginTop: '15px' }}
                        >
                          <Field
                            label="Password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            value={values.password}
                            type="password"
                            component={TextField}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          style={{ marginTop: '15px' }}
                        >
                          <FormControl fullWidth variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">
                              Researcher Type
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              label="Researcher Type"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.researcherType}
                              name="researcherType"
                            >
                              {options.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <span className="error">{researchTypeError}</span>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          style={{ marginTop: '15px' }}
                        >
                          <Field
                            label="City"
                            variant="outlined"
                            fullWidth
                            name="city"
                            value={values.city}
                            component={TextField}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Grid
                      item
                      container
                      spacing={1}
                      justify="center"
                      style={{ paddingBottom: '25px', paddingTop: '25px' }}
                    >
                      <Grid item xs={12} sm={6} md={6}>
                        <CardActions style={{ paddingLeft: '15px' }}>
                          <Button
                            disabled={!dirty || !isValid}
                            variant="contained"
                            color="primary"
                            type="Submit"
                          >
                            REGISTER
                          </Button>
                        </CardActions>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        style={{
                          float: 'right',
                          paddingLeft: '85px',
                          marginTop: '10px'
                        }}
                      >
                        <CardActions style={{ padding: '0px' }}>
                          <span>Do you have an account?</span>
                          <Link to="/signin">
                            <Button variant="contained" color="primary">
                              LOGIN
                            </Button>
                          </Link>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Form>
                )
              }}
            </Formik>
          </Card>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </React.Fragment>
  )
}

export default SignUp
