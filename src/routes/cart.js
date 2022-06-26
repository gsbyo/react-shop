import axios from "axios";
import { set } from "mongoose";
import { useEffect, useState } from "react"
import '../css/cart.css'

function Cart(){
    const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart'), ','))
    const [limitCount, setlimitCount] = useState();

    const [checkCart, setCheckCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const plusCount = (id) => {
       const addCart = cart.map( p => {
           if(p.id == id ){ 
            return { ...p , count : parseInt(p.count) + 1 }
           }else return p;
       })

       const addCheckCart = checkCart.map( p => {
        if(p.id == id ){ 
            setTotalPrice(totalPrice + ((p.price - (p.price * p.discount / 100))));
         return { ...p , count : parseInt(p.count) + 1}
        }else return p;
    })
     
       setCart(addCart);
       setCheckCart(addCheckCart);
    }

    const minusCount = (id) => {
        const addCart = cart.map( p => {
            if(p.id == id && p.count > 1){ 
             return { ...p , count : parseInt(p.count) - 1 }
            }else return p;
        })
 
        const addCheckCart = checkCart.map( p => {
         if(p.id == id && p.count > 1){ 
            setTotalPrice(totalPrice - ((p.price - (p.price * p.discount / 100))));
          return { ...p , count : parseInt(p.count) - 1}
         }else return p;
     })
      
        setCart(addCart);
        setCheckCart(addCheckCart);
    }

    const delelteHandler = async (id) => {
        let delCart = [];
        let delCheckCart = [];
 
        await cart.forEach( (p, i) => {
           if(p.id != id) delCart.push(p);
        })

        await checkCart.forEach( p => {
            if(p.id != id){
                delCheckCart.push(p);
            }else{
                setTotalPrice(totalPrice - ((p.price - (p.price * p.discount / 100)) * p.count));
            }
        })
       
        sessionStorage.setItem('cart', JSON.stringify(delCart));  
        setCart(delCart);
        setCheckCart(delCheckCart);


    }
   
    const checkOne = (p, check) => {
      let arr = [];

      if(check == true){
         arr = [...checkCart];
         arr.push(p);
         setTotalPrice(totalPrice + ((p.price - (p.price * p.discount / 100)) * p.count));
      }else{
        checkCart.forEach( c =>{
            if(c.id == p.id){
               setTotalPrice(totalPrice - ((p.price - (p.price * p.discount / 100)) * p.count));
            }else{
               arr.push(c);
            }       
        })
      }
      console.log(arr);

      setCheckCart(arr);
    }
 
    return(
        <div className="cart-container" style={{backgroudColor:'gray', marginTop:30}}>
            <h2>장바구니</h2>
            <table className="cart-table">
            <tr className="cart-table-header">
                <th></th>
                <th>상품정보</th>
                <th>상품가격</th>
                <th>상품갯수</th>
                <th></th>
            </tr>
            {     
                    cart != null ?
                        cart.map( (p) => {
                            return (
                                <tr>
                                    <td><input type='checkbox' onChange={ (e) => { checkOne(p, e.target.checked) }}></input></td>
                                    <td>
                                        <div className="cart-img-box" style={{ display: 'flex' }}>
                                            <div className="cart-img-wrap">
                                                <img src={'http://localhost:8080/img/load/' + p.img} style={{ width: '60px', height: '100%' }} />
                                            </div>
                                            <div style={{ width: '70%' }}>
                                                <div>
                                                    <span>{p.name}</span>
                                                    <span style={{ opacity: 0.5 }}><br />{p.option_1}</span>
                                                    <span style={{ opacity: 0.5 }}><br />{p.option_2}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                    {
                                        
                                        p.discount > 0 ?
                                         <div>
                                         <del>{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</del>
                                         <p>{ (p.price - ( p.price * (p.discount / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>     
                                         </div>     
                                         :<p>{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                    }
                                    </td>
                                    <td><p><button className="cart-button-plus btn" style={{ marginRight: 10 }} onClick={(e) => {plusCount(p.id)}}>+</button>{p.count}<button className="cart-button-minus btn" style={{ marginLeft: 10 }} onClick={(e) =>{ minusCount(p.id)}}>-</button></p></td>
                                    <td><p><button className="cart-del-button btn" onClick={(e) => { delelteHandler(p.id) }}>X</button></p></td>
                                </tr>
                            )
                        })
                        : null
            }

         
            </table>
            <div className="cart-total-box">
                {
                  /*  checkProduct != null ?
                    checkProduct.map( (p) => {
                        return <p>{p.name}</p>
                    }) 
                    : null*/
                }
                <div style={{padding:10}}>
                  <span>총 결제 금액 : {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span>
                </div>
            </div>
            <div className="cart-button">
               <button style={{ marginRight : 10}}>계속 쇼핑하기</button>
               <button>구매하기</button>
            </div>
        </div>
    )
}



export default Cart;