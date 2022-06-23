import { useParams } from 'react-router-dom'
import '../css/detail.css'

import TopMenu from './top.js'

import axios from 'axios'
import { useState, useEffect } from 'react'

function Product() {

    let {id} = useParams();
    let [ product, setProduct ] = useState();
    let [ stock, setStock ] = useState([]); // 재고 

    let [option_1, setOption_1] = useState();
    let [option_2, setOption_2] = useState();

    let [count, setCount] = useState('')
    
    useEffect( () => {
        axios.get('http://localhost:8080/detail/product/' + id).then(( result ) => {
            setProduct(result.data);
           }).catch( (err) => {
            console.log(err)
           })  
           
        axios.get('http://localhost:8080/get/stock/' + id).then( (result) => {
             console.log(result.data);
             setStock(result.data);

             setOption_1(result.data[0].option_1);
             setOption_2(result.data[0].option_2);
        }).catch( (err) => {
            console.log(err)
        })

    },[]) 

    function addCart(id, count) {
        if(count == '') return alert('수량을 입력해주세요')

        let cart = sessionStorage.getItem("cart");
        let inCart = false;

        if (cart == null) {
            sessionStorage.setItem('cart', JSON.stringify([
                {
                    id : id,
                    name : product.name,
                    price : product.price,
                    option_1 : option_1,
                    option_2 : option_2,
                    count : count,
                    discount : product.discount,
                    img : product.img,
                }
            ]
            ));
            return alert('장바구에 상품을 추가하였습니다');
        }

        cart = JSON.parse(cart);

        cart.forEach(p => {
            if(p.id == id) inCart = true;
        })

        if(inCart == false){
            cart.push({
                id : id,
                name : product.name,
                price : product.price,
                option_1 : option_1,
                option_2 : option_2,
                count : count,
                discount : product.discount,
                img : product.img,
            })
        }else{
            return  alert('해당 상품은 이미 장바구니에 있습니다');
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        alert('장바구에 상품을 추가하였습니다');
    }

    
      const checkCount =  async (e) => {
  
          const regex = new RegExp("/^[0-9]+$/");

          let limitNumber;

          if(!regex.test(e.target.value)){
              await stock.forEach( (s) => {
                  if( (s.option_1 == option_1 && s.option_2 == option_2 ) 
                     || ( s.option_1 == option_1 && s.option_2 == 'none') ) {
                            limitNumber = s.stock;
                  }
                  if(e.target.value < limitNumber){
                    return setCount(e.target.value)
                  }
                    return setCount(limitNumber);
              })
          }
      }

    return (
        
         <>
         <TopMenu />
            {
                product != null 
                ? 
                    <div className="detail-container">
                         <div style={{ width: '50%', height:'100%', display:'flex', alignItems:'center'}}>
                        <div className='img-wrap'>
                                <img src={'http://localhost:8080/img/load/' + product.img} />
                        </div>
                        </div>
                        <div style={{ width: '50%' }}>
                            <div className='info-box'>
                                <div className='box-wrap'>
                                    <h4 style={{ width: '100%' }}>{product.name}</h4>
                                    {
                                         product.discount > 0 ?
                                         <div>
                                         <del>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</del>
                                         <p>{ (product.price - ( product.price * (product.discount / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>     
                                         </div>     
                                         :<p>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                    }
                                </div>
                            </div>

                            <div className='option-box'>
                                <div className='box-wrap'>
                                    {
                                        stock.length != 0 ?
                                        <div className='option-container'>
                                        <div style={{width:'100%',padding:10, borderBottom:'1px solid gainsboro'}}>
                                        <p>Size</p>
                                        <select value={option_1} defaultValue="red" onChange={ (e) => { setOption_1(e.target.value) }} style={{width:100}}>
                                            {
                                                stock.map( (s, i) => {
                                                    return <option value={s.option_1}>{s.option_1}</option>
                                                })
                                            }
                                        </select>
                                        </div>           
                                        <div style={{width:'100%',padding:10, borderBottom:'1px solid gainsboro'}}>
                                        <p>Color</p>
                                        <select value={option_2} defaultValue="large" onChange={ (e) => { setOption_2(e.target.value) }} style={{width:100}}>
                                            {
                                                stock.map( (s, i) => {
                                                    return <option value={s.option_2}>{s.option_2}</option> 
                                                })
                                            }
                                        </select>
                                        </div>
                                        <div style={{width:'100%',padding:10, borderBottom:'1px solid gainsboro'}}>
                                        <p>Count</p>
                                        <input className='count-input' type='number' id='number' value={count} style={{width:'100px'}} min='1' onChange={ (e) => {checkCount(e)} }/>
                                        </div>      
                                    </div>
                                        : <p>품절</p>
                                    }
                                </div>

                            </div>
                            
                            <div className='order-box'>
                                <div className='wrap'>
                                  <p>총 결제 금액 : { count == 0 ? 0 : (count * product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원' }</p>
                                    <button className="btn btn-primary" style={{ marginRight: 10 }}>주문하기</button>
                                    <button className="btn btn-primary" style={{ marginRight: 10 }} onClick={() => { addCart(product.id, count) }}>장바구니</button>
                                    <button className="btn btn-primary">찜하기</button>
                                </div>
                            </div>
                        </div>
                    </div>

               : null
            }
        </>

    )


    }

export default Product;