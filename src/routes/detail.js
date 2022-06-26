import { useParams } from 'react-router-dom'
import '../css/detail.css'

import TopMenu from './top.js'

import axios from 'axios'
import { useState, useEffect } from 'react'

function Product() {

    let {id} = useParams();
    let [ product, setProduct ] = useState();
    let [ stock, setStock ] = useState([]); // 재고 

    let [option_1, setOption_1] = useState([]);
    let [option_2, setOption_2] = useState([]);

    let [selectOption, setSelectOption] = useState();
    let [selectOption2, setSelectOption2] = useState();

    let [count, setCount] = useState(1);

    
    useEffect( () => {
      let arr = [];
       stock.forEach( (s) => {
            if(s.option_1 == selectOption) arr.push(s.option_2);
        })

       setOption_2(arr);
       setSelectOption2(arr[0]);

    }, [selectOption])

    useEffect( () => {
        setCount(1);
    },[selectOption2])

    
    useEffect( () => {
        axios.get('http://localhost:8080/detail/product/' + id).then(( result ) => {
            setProduct(result.data);
           }).catch( (err) => {
            console.log(err)
           })  
           
        axios.get('http://localhost:8080/get/stock/' + id).then( (result) => {
             console.log(result.data);
             setStock(result.data);

             let set = new Set;

             result.data.forEach( (s => {
                set.add(s.option_1);
             }))
             let arr = Array.from(set);
        
             setOption_1(arr);
             setSelectOption(arr[0]);
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
                    option_1 : selectOption,
                    option_2 : selectOption2,
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

          if(e.target.value == '0') return setCount(1);
  
          let check = new RegExp(/[^0-9]/g);

          let limitNumber;

          if(!check.test(e.target.value)){
              await stock.forEach( (s) => {
                  if( (s.option_1 == selectOption && s.option_2 == selectOption2 ) 
                     || ( s.option_1 == selectOption && s.option_2 == 'none') ) {
                            limitNumber = s.stock;
                  }
                  if(e.target.value < limitNumber){
                    return setCount(e.target.value)
                  }else{
                    return setCount(limitNumber);
                  }
              })
          }else{
            setCount('');
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
                                        <select value={selectOption} onChange={ (e) => { setSelectOption(e.target.value) }} style={{width:100}}>
                                            {
                                                option_1  ?
                                                option_1.map( (s, i) => {
                                                    return <option value={s}>{s}</option>
                                                })
                                                : null
                                            }
                                        </select>
                                        </div>           
                                        <div style={{width:'100%',padding:10, borderBottom:'1px solid gainsboro'}}>
                                        <p>Color</p>
                                        <select value={selectOption2} onChange={ (e) => { setSelectOption2(e.target.value) }} style={{width:100}}>
                                            {
                                               option_2 != null ?
                                               option_2.map( (o => {
                                                return <option value={o}>{o}</option> 
                                               }))
                                               : null
                                 
                                            }
                                        </select>
                                        </div>
                                        <div style={{width:'100%',padding:10, borderBottom:'1px solid gainsboro'}}>
                                        <p>Count</p>
                                        <input className='count-input' type='text' value={count} style={{width:'100px'}} onChange={ (e) => {checkCount(e)} }/>
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