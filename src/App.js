/* eslint-disable */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'


import { useDispatch, useSelector } from "react-redux"
import { changeLogin } from "./store"
import { useAsync } from "react-async"

//routes
import Main from './routes/main.js'
import Detail from './routes/detail'
import Login from './routes/login'
import ProductMgt from './routes/edit';
import List from './routes/list'
import Cart from './routes/cart'

import axios from 'axios'

function App() {

  let [Role, setRole] = useState(false);

  useEffect ( () => {
      const loggedUser = localStorage.getItem('user') // 로컬스토리지에서 로그인 유저를 불러옴
      
      axios.post('http://localhost:8080/auth/login/proc',{ user : loggedUser }, { withCredentials: true }) //서버에서 로그인 된 유저아이디가 유효한지 확인
      .then( (res) => {
         if(res.data == ''){ //유효하지 않을 경우 
          if(loggedUser) localStorage.removeItem('user') // 로컬스토리지에 로그인아이디가 있다면 지워줌
          //로그인이 되지않았기 때문에 권한을 none으로 설정
          setRole('none')        
         }else{ // 유효할 경우
          if(loggedUser != res.data || !loggedUser) localStorage.setItem('user', res.data) // 쿠키는 있지만 유저가 로컬스토리지에 저장되지않았거나 유저아이디가 다른 경우 유저아이디를 저장함  
          //로그인 된 계정의 권한을 설정함
          setRole(res.data.role)      
         }
      }).catch( (err) => {
        console.log(err);
      })
  },[])


    return (
      <Routes>
        <Route path="/" element = { <Main /> }>  </Route>
        <Route path="auth/login" element = { <Login /> } ></Route>
        <Route path="/detail/:id" element = { <Detail /> } ></Route>

        <Route path="/:path" element = { <List /> } ></Route>
       
        <Route path="/order/cart" element = { <Cart /> } ></Route>

        <Route path="admin/edit" element = { <ProductMgt Role = { Role } /> } ></Route>
      </Routes>
     );
  
 
}

export default App;
