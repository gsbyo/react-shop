import Slide from './slide'
import TopMenu from './top.js'
import Bottom from './bottom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import '../css/home.css'

function Main(props) {

    let [ product, setProduct ] = useState();

    let [slideBest, setSlideBest] = useState(0);

    let [slideNew, setSlideNew] = useState(0);


    let user = props.user;

    useEffect(()=>{
        axios.get('http://localhost:8080/main/product', {withCredentials : true}).then(( result ) => {
            setProduct(result.data);
           }).catch( (err) => {
            console.log(err)
        })
    },[]) 
    
    function next(name){
       if(name == 'BEST'){
        if(slideBest < 2) setSlideBest(++slideBest);
       }else{
        if(slideNew < 2) setSlideNew(++slideNew);
       }
    }

    function prev(name){
        if(name == 'BEST'){
            if(slideBest > 0) setSlideBest(--slideBest);
           }else{
            if(slideNew > 0) setSlideNew(--slideNew);
           }
    }

    return (
        <div className='home-container'>
            <TopMenu />
            <Slide />
            {
                product != null 
                ? 
                <div className="box-container" style={{marginTop:30}}>
                <h3 style={{width:'100%'}}>BEST ITEM</h3>
                <button className='prev' onClick={() => {prev('BEST')}}><i className="arrow left"></i></button>
                <button className='next' onClick={() => {next('BEST')}}><i className="arrow right"></i></button>
                <div className={ slideBest === 0 ? 'slide-wrap ' : slideBest === 1 ? 'slide-wrap slide-margin' : 'slide-wrap slide-margin2'}>
                
                {
                    product.map( (p, i) => {
                    return <Box product = { p } i = {i} key = {i}/>
                    })
                }
                </div>
                </div>
                : null
            }

            {
                product != null 
                ? 
                <div className="box-container">
                <h3 style={{width:'100%'}}>NEW ITEM</h3>
                  <button className='prev' onClick={() => {prev('NEW')}}><i className="arrow left"></i></button>
                  <button className='next' onClick={() => {next('NEW')}}><i className="arrow right"></i></button>
                <div className={ slideNew === 0 ? 'slide-wrap ' : slideNew === 1 ? 'slide-wrap slide-margin' : 'slide-wrap slide-margin2'}>
                
                {
                    product.map( (p, i) => {
                    return <Box product = { p } i = {i} key = {i}/>
                    })
                }
                </div>
                </div>
                : null
            }
            <div style={{marginBottom:20}}></div>

            { 
        
                 product != null 
                 ?  <Bottom />
                 : null 
        
            }
        </div>
    )
}

function Box(props){
   let navigate = useNavigate();

    return (
        <div className='box' onClick={() => { navigate('/detail/' + props.product.id) }} >
            <div className='main-img-wrap' style={{ width:'100%'}}>
                <img src={'http://localhost:8080/img/load/' + props.product.img} />
            </div>
            <div style={{ padding: 10 }}>
                <h5>{props.product.name}</h5>
                {
                    props.product.discount > 0 
                    ?
                    <div>
                    <del>{props.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</del>
                    <p>{  ( parseInt(props.product.price ) - (parseInt(props.product.price)  * ( parseInt(props.product.discount) / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원 </p>
                    </div>
                    :
                    <p>{props.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 </p>
                }

  
                
            </div>
        </div>
    )
}



export default Main;


