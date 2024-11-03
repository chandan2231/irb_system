import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Backdrop from '@mui/material/Backdrop'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'

const PrivateRoutes = () => {
  // const user = useSelector((store) => store.authSlice.auth.user);
  const { user, loading, error } = useSelector((state) => ({
    error: state.auth.error,
    user: state.auth.signinUser.data,
    loading: state.auth.loading
  }))
  // console.log('user', user)
  const [loader, setLoader] = useState(true)
  const navigate = useNavigate()

  function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
      return match[2]
    }
  }
  const validateToken = async (e) => {
    try {
      const cookieName = 'accessToken'
      const getCookie = getCookieValue(cookieName)
      let res = await axios.get('http://localhost:8800/api/auth/', {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie
        }
      })
      if (res.status === 200) {
        setLoader(false)
        navigate('/market')
        // if(window.location.pathname !== '/research-type'){
        //     navigate('/research-type')
        // }
        // if(window.location.pathname !== '/dashboard'){
        //     navigate('/dashboard')
        // }
      } else {
        // if(window.location.pathname !== '/'){
        //     navigate('/signin')
        // }
        setLoader(false)
      }
    } catch (err) {
      // if(window.location.pathname !== '/'){
      //     navigate('/signin')
      // }
      setLoader(false)
    }
  }
  useEffect(() => {
    validateToken()
  })
  if (loader) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  return user != null ? <Outlet /> : <Navigate to="/signin" />
  // return (user != null ? <Outlet /> : <Navigate to = "/signin" />)
}

export default PrivateRoutes
