import axios from 'axios';
import { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap'
import '../css/top.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


function Top() {

    let [search] = useState( false );

    let loggedUser = localStorage.getItem('user')

    return (
        <div style={{ width: '100%'}}>
            <div className='logo'>
            <Navbar>
                    <Nav className='justify-content-end flex-grow-1 pe-3' style={{fontSize:13}}>
                        {
                        !loggedUser 
                        ?
                        <>
                        <Nav.Link href="/auth/login">LOGIN</Nav.Link>
                        <Nav.Link href="#">JOIN</Nav.Link>
                        </>
                        :<Nav.Link onClick={ logout }>LOGOUT</Nav.Link>
                        }
                        <Nav.Link href="#">MYPAGE</Nav.Link>
                        <Nav.Link href="#">ORDER</Nav.Link>
                        <Nav.Link href="/order/cart">CART</Nav.Link>
                    </Nav>
            </Navbar>
            </div>
            <div className='menu-bar'>
            <Navbar>
                <Container style={{ fontSize: 15 }}>
                    <Navbar.Brand href="/">GSBYOSHOP</Navbar.Brand> 
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/best">BEST</Nav.Link>
                            <Nav.Link href="/new">NEW</Nav.Link>
                            <Nav.Link href="/top">TOP</Nav.Link>
                            <Nav.Link href="/shirts">SHIRTS</Nav.Link>
                            <Nav.Link href="/pants">PANTS</Nav.Link>
                            <Nav.Link href="/outer">OUTER</Nav.Link>
                            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                             <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> 
                        </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                    <Form className="d-flex">
                        <FormControl
                            type='text'
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            style={{width:150}}
                        />
                        <Button variant="lg" style={ {backgroundColor: "white", padding: 5, paddingLeft: 10, paddingRight: 10, fontSize: 15, border:'1px solid gainsboro'}}><FontAwesomeIcon icon={faSearch} className="search" />
                        {
                            search == true
                            ? console.log(1)
                            : null
                        }
                        </Button>

                    </Form>
                </Container>
            </Navbar>
            </div>
        </div>
    )

    function logout(){
      
       axios.get('http://localhost:8080/auth/logout', { withCredentials : true })
        .then( (res) => {
          window.location.reload();
        })
        .catch( (err) => {
           console.log(err)
        })
    }


}


export default Top;
