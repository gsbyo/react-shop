import { configureStore, createSlice } from '@reduxjs/toolkit'

let login = createSlice({
  name : 'login',
  initialState : false,
  reducers : {
    changeLogin(state){
      return !state
    }
  }
}) 

export let { changeLogin } = login.actions 

export default configureStore({
  reducer: { 
    login : login.reducer
  }
}) 

