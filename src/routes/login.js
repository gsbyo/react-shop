import { Form, Button } from 'react-bootstrap'
import { useState, useEffect, React } from 'react'
import '../css/login.css'
import axios from 'axios'

import { useDispatch, useSelector } from "react-redux"


function Login(){

    let [Id, setId] = useState()
    let [Pwd, setPwd] = useState()

    let [User, setUser] = useState(false); 
    
    useEffect( () => {
      if(localStorage.getItem('user')) setUser(true);
    }, [])
    
    return (
        <div className='login-container'>
            {
                User == false
                ?
                <>
                <h3 className='text-center mt-4'>로그인</h3>
                <Form className='w-100' style={ { margin : '0 auto', padding : 20} }>
                    <Form.Control className='mt-4 w-100'
                        type="text"
                        id="inputId"
                        placeholder='아이디를 입력해주세요'
                        name="id"
                        onChange={(e) => setId(e.target.value)}
                    />
                    <Form.Control className='mt-4 w-100'
                        type="password"
                        id="inputPassword"
                        placeholder='비밀번호를 입력해주세요'
                        name="pw"
                        aria-describedby="passwordHelpBlock"
                        onChange={(e) => setPwd(e.target.value)}
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                    </Form.Text>
                    <Button onClick={ () => loginSubmit(Id, Pwd) } className='w-100 mt-4'>로그인</Button>
                </Form>
               
                </>
                :  window.history.back()
            }

        </div>
    )

    function loginSubmit(id, pwd){
        console.log(id, pwd)

       axios.post('http://localhost:8080/auth/login', { 
           id : id,
           pw : pwd 
       },{ withCredentials: true }).then( (res) => {
           setUser(true);
           localStorage.setItem('user', res.data)
       }).catch( (err) => {
           alert("로그인에 실패하였습니다");
       })
    }
}


export default Login;