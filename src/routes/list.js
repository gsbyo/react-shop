import { useParams } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import Top from '../routes/top'
import axios from 'axios';
import Loader from "./Loader";
import { useNavigate } from 'react-router-dom'

import '../css/list.css'

function List() {
    let {path} = useParams();
    
    const [product, setProduct] = useState(null);
    const [page , setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState(null);
    const [end, setEnd] = useState(false);


    useEffect( () => {
       loadProduct();
    }, [page])

    useEffect(() => {
        let observer;
        if (target) {
          observer = new IntersectionObserver(onIntersecting, {
            threshold: 0.4,
          });
          observer.observe(target);
        }
        return () => observer && observer.disconnect();
      }, [target]);


      const onIntersecting = async ([entry], observer) => {
        if(entry.isIntersecting && !loading && !end){
            observer.unobserve(entry.target);
            setPage(page + 1);            
        }
     }


    const loadProduct = async () => {
        setLoading(true);

        await axios.get('http://localhost:8080/get/product/'+ path + '/' + page).then( (res) => {
           if(res.data == '') return setEnd(true);
           console.log(res.data)
           setProduct(res.data);
        })

        setLoading(false);
    }

 
    
    return(
        <div>
            <Top />
            <h2 style={{ padding: 20, textAlign: 'center' }}>{path}</h2>
            <div className='list-container'>
            {
                product != null ?
                    product.map((p) => {
                       return <Box product = {p} />
                    })
                    : null
            }
              </div>
            {
                product != null ?
                <div ref={setTarget}>
                {loading && <Loader />}
                </div>
                :null
            }
            
      
        </div>

    )
}

function Box(props){
    let navigate = useNavigate();
 
     return (
         <div className='box' onClick={() => { navigate('/detail/' + props.product.id) }}  >
             <div className='main-img-wrap' style={{ width:'100%'}}>
                 <img src={'http://localhost:8080/img/load/' + props.product.img} />
             </div>
             <div style={{ padding: 10}}>
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


export default List;