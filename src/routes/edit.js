import '../css/edit.css'
import axios from "axios"
import { useEffect, useState, useRef } from "react"



function Edit(props) {
  let [TabActive, setTabActive] = useState(0);

  const InputImg = useRef(null);

  if (props.Role == false) {
    return null
  }

  if (props.Role == 'admin') {

    return (
      <div className='container' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className='w-100'>
          <h2 className="text-center p-4" style={{ border: '1px solid gainsboro', color: 'white', backgroundColor: '#0d6efd' }}>관리자 페이지</h2>
        </div>
        <div className='w-100' style={{ display: 'flex' }}>
          <div className='tab-container'>
            <button className={(TabActive == 0 ? 'tab-active' : null)} onClick={(e) => { setTabActive(0) }}>상품 등록</button>
            <button className={(TabActive == 1 ? 'tab-active' : null)} onClick={(e) => { setTabActive(1) }}>재고 등록</button>
            <button className={(TabActive == 2 ? 'tab-active' : null)} onClick={(e) => { setTabActive(2) }}>상품 수정</button>
            <button className={(TabActive == 3 ? 'tab-active' : null)} onClick={(e) => { setTabActive(3) }}>재고 수정</button>
          </div>
          <div className='edit-container'>
            <Tab Active={TabActive} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-center">404 Not Found</h1>
    </div>
  )

  function Tab(props) {
    const [img, setImg] = useState({
      img_file: '',
      preview_img: '/img/notReady.png'
    })

 
    //상품등록 정보 
    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [category, setCategory] = useState('top');
    const [discount, setDiscount] = useState('0');
    const [status, setStatus] = useState('on');
    const [imgName, setImgName] = useState();

    const [searchText, setSearchText] = useState() // 검색텍스트
    const [searchResult, setSearchResult] = useState([]); // 검색 데이터
    const [stockResult, setStockResult] = useState([]); // 활성화 된 재고 데이터

    //재고등록 정보
    const [option1, setOption1] = useState();
    const [option2, setOption2] = useState();
    const [stock, setStock] = useState();

    const [isCheck, setIsCheck] = useState(); //체크된 상품
    const [isUpdate, setIsUpdate] = useState(); //수정할 재고


    function initProduct() {
      setName('');
      setPrice('');
      setCategory('top');
      setDiscount('0');
      setStatus('on')
      setImgName('');

      //  setSearchText('');
      setSearchResult([]);
      setStockResult([]);

      setIsCheck('');
      setIsUpdate('');
    }


    function initStock() {
      setOption1('');
      setOption2('');
      setStock('');

      setSearchText('');
      setSearchResult([]);
      setStockResult([]);

      setIsCheck('');
      setIsUpdate('');
    }




    async function previewImg(e) {
      e.preventDefault();
      const fileReader = new FileReader();

      if (e.target.files[0]) {
        fileReader.readAsDataURL(e.target.files[0])
      }

      fileReader.onload = () => {
        setImg(
          {
            img_file: e.target.files[0],
            preview_img: fileReader.result
          }
        )

        setImgName(e.target.files[0].name)
        }

    }

    function deleteImg() {
      setImg({
        img_file: '',
        preview_img: '/img/notReady.png',
      });
    }


   function multerImg() {
      const formData = new FormData();

      formData.append('file', img.img_file);

      axios.post('http://localhost:8080/admin/upload/img', formData)
        .then(() => {
          setImg({
            img_file: '',
            preview_img: '/img/notReady.png',
          });
        })
        .catch((err) => {
          console.log(err);
        })

    }

    function createProduct() {

     
      if (img.img_file == '') return alert('상품 이미지 등록을 해주세요')

      multerImg();

      let product = {
        name: name,
        price: price,
        category: category,
        discount: discount,
        status: status,
        img: imgName
      }


      axios.post('http://localhost:8080/admin/add/product', product).then(() => {

        initProduct();

        alert('상품이 추가되었습니다')
      }).catch((err) => { console.log(err) })


    }


    function updateProduct() {
      if (isCheck == null) return alert('수정할 상품을 선택해주세요');

      if (img.img_file != '') {
        multerImg().then(() => {
          let product = {
            name: name,
            price: price,
            category: category,
            discount: discount,
            status: status,
            img: imgName
          }
          axios.post('http://localhost:8080/admin/update/product', { product: product, id: isCheck }).then(() => {

            initProduct();

            setImg({
              img_file: '',
              preview_img: '/img/notReady.png',
            });

            alert('상품이 수정되었습니다')
          }).catch((err) => { console.log(err) })

        })
      }

    }


    function deleteProduct() {
      if (isCheck == null) return alert('삭제할 상품을 선택해주세요');

      axios.delete('http://localhost:8080/admin/delete/product/' + isCheck).then(() => {
        setImg({
          img_file: '',
          preview_img: '/img/notReady.png',
        });

        initProduct();

        alert('삭제완료')
      }).catch((err) => {
        console.log(err);
      })


    }


    function search() {
      axios.get('http://localhost:8080/search/product/' + searchText).then((res) => {
        setSearchResult(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }


    function setStockData(s) {
      setIsUpdate(s.id)
      setOption1(s.option_1);
      setOption2(s.option_2);
      setStock(s.stock);
    }

    const stockAdd = () => {
      if (isCheck == null) return alert("재고를 추가 할 아이템을 선택해주세요")

      let add = {
        p_id: isCheck,
        option_1: option1,
        option_2: option2,
        stock: stock
      }

      let stock_arr = [...stockResult];

      stock_arr.push(add);
      console.log(stock_arr);
      setStockResult(stock_arr);


    }

    function stockSubmit() {
      axios.post('http://localhost:8080/admin/submit/stock', { stock: stockResult }).then((res) => {
        alert('재고를 등록하였습니다');

        initStock();

      }).catch((err) => {
        console.log(err);


      })
    }

    function getStock(id) {
      setIsCheck(id);
      axios.get('http://localhost:8080/admin/get/stock/' + id).then((res) => {
        setStockResult(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }


    function setProduct(product) {
      setIsCheck(product.id);
      setName(product.name)
      setPrice(product.price)
      setCategory(product.category)
      setStatus(product.status)
      setDiscount(product.discount)
      setImgName(product.img)

      setImg(
        {
          preview_img: product.img
        }
      )

    }



    function BoxSearch(props) {
      return (
        <tr>
          <td><input type='checkbox' checked={isCheck == props.Search.id ? true : false} onChange={(e) => { setIsCheck(props.Search.id) }}></input></td>
          <td>{props.Search.name}</td>
          <td>{props.Search.price}</td>
          <td>{props.Search.status}</td>
          <td>{props.Search.discount}</td>
        </tr>
      )
    }

    function BoxSetProduct(props) {
      return (
        <tr>
          <td><input type='checkbox' checked={isCheck == props.Search.id ? true : false} onChange={(e) => { setProduct(props.Search) }}></input></td>
          <td>{props.Search.name}</td>
          <td>{props.Search.price}</td>
          <td>{props.Search.status}</td>
          <td>{props.Search.discount}</td>
        </tr>
      )
    }

    function BoxGetStock(props) {
      return (
        <tr>
          <td><input type='checkbox' checked={isCheck == props.Search.id ? true : false} onChange={(e) => { getStock(props.Search.id) }}></input></td>
          <td>{props.Search.name}</td>
          <td>{props.Search.price}</td>
          <td>{props.Search.status}</td>
          <td>{props.Search.discount}</td>
        </tr>
      )
    }

    function BoxSetStock(props) {
      return (
        <tr>
          <td>{props.Stock.p_id}</td>
          <td>{props.Stock.option_1}</td>
          <td>{props.Stock.option_2}</td>
          <td>{props.Stock.stock}</td>
        </tr>
      )
    }

    function BoxEditStock(props) {

      const [changeOption1, setChangeOption1] = useState(option1);
      const [changeOption2, setChangeOption2] = useState(option2);
      const [changeStock, setChangeStock] = useState(stock);

      const deleteStock = (id) => {
        axios.delete('http://localhost:8080/admin/delete/stock/' + id).then(() => {
          alert('삭제완료')
          setStockResult(null);
          setSearchResult(null);
          setIsUpdate('');
          setIsCheck('');
        }).catch((err) => {
          console.log(err)
        })
      }

      const updateStock = (id) => {
        let cs = {
          p_id: id,
          option_1: changeOption1,
          option2: changeOption2,
          stock: changeStock
        }

        axios.post('http://localhost:8080/admin/update/stock', { stock: cs, id: isUpdate }).then(() => {
          alert('수정완료')

          initStock();

        }).catch((err) => {
          console.log(err)
        })


      }


      return (
        <tr>
          <td><input type='checkbox' checked={isUpdate == props.Stock.id ? true : false} onChange={(e) => { setStockData(props.Stock) }}></input></td>
          <td>
            {props.Stock.p_id}
          </td>
          <td>
            {
              isUpdate != props.Stock.id ?
                props.Stock.option_1
                : <input type='text' value={changeOption1} onChange={(e) => { setChangeOption1(e.target.value) }} />
            }
          </td>
          <td>
            {
              isUpdate != props.Stock.id ?
                props.Stock.option_2 :
                <input type='text' value={changeOption2} onChange={(e) => { setChangeOption2(e.target.value) }} />
            }
          </td>
          <td>{
            isUpdate != props.Stock.id ?
              props.Stock.stock :
              <input type='text' focus value={changeStock} onChange={(e) => { setChangeStock(e.target.value) }} />
          }
          </td>
          {
            isUpdate == props.Stock.id ?
              <td style={{ padding: 2 }}><button style={{ padding: 3, paddingLeft: 7, paddingRight: 7, backgroundColor: '#0d6efd', border: 0, borderRadius: 4, color: 'white' }} onClick={() => { updateStock(props.Stock.p_id) }}>수정</button></td>
              :
              <td style={{ padding: 2 }}><button style={{ padding: 3, paddingLeft: 7, paddingRight: 7, backgroundColor: '#0d6efd', border: 0, borderRadius: 4, color: 'white' }} onClick={() => { deleteStock(props.Stock.id) }}>삭제</button></td>
          }

        </tr>
      )
    }



    switch (props.Active) {
      case 0:
        return (
          <div className='container'>
            <div style={{ padding: 10, paddingBottom: 0 }}>
              <p>상품명</p>
              <p><input type='text' style={{ width: '100%' }} value={name} onChange={(e) => { setName(e.target.value) }}></input></p>
            </div>
            <div className='img-container'>
              <div className='img-box'>
                <img src={img.preview_img} width='100%' height='100%' style={{ padding: 10, objectFit: 'contain' }}></img>
              </div>
              <div className='input-container'>
                <div className='input-wrap'>
                  <div className='input-box'>
                    <p>가격</p>
                    <p><input type='number' value={price} onChange={(e) => { setPrice(e.target.value) }}></input></p>
                  </div>
                  <div className='input-box'>
                    <p>카테고리</p>
                    <p><select value={category} onChange={(e) => { setCategory(e.target.value) }}>
                      <option value='top'>top</option>
                      <option value='shirts'>shirts</option>
                      <option value='pants'>pants</option>
                      <option value='outer'>outer</option>
                    </select></p>
                  </div>
                  <div className='input-box'>
                    <p>등록상태</p>
                    <p><select value={status} onChange={(e) => { setStatus(e.target.value) }}>
                      <option value='on'>판매중</option>
                      <option value='off'>품절</option>
                      <option value='out'>판매중지</option>
                    </select></p>
                  </div>
                  <div className='input-box'>
                    <p>할인</p>
                    <p><select value={discount} onChange={(e) => { setDiscount(e.target.value) }}>
                      <option value='0'>없음</option>
                      <option value='5'>5%</option>
                      <option value='10'>10%</option>
                      <option value='15'>15%</option>
                      <option value='20'>20%</option>
                      <option value='50'>50%</option>
                    </select></p>
                  </div>
                </div>


              </div>
            </div>

            <div className='button-box'>
              <input ref={InputImg} type='file' accept='image/*' name='file' onChange={(e) => { previewImg(e) }} style={{ display: 'none' }}></input>
              <button style={{ marginRight: 20 }} onClick={ImgButtonClick}>이미지 등록</button>
              <button style={{ marginRight: 20 }} onClick={deleteImg}>이미지 삭제</button>
              <button onClick={createProduct}>상품 등록</button>
            </div>
          </div>
        )
      case 1:
        return (
          <div className='container'>
            <div style={{ padding: 10 }}>
              <p>상품 검색</p>
              <input type='text' value={searchText} onChange={(e) => { setSearchText(e.target.value) }} /><button className='basic-button' onClick={(e) => { search() }} style={{ marginLeft: 10 }}>검색</button>
            </div>
            <div className='search-result'>
              <table className='search-box'>
                <thead>
                <tr>
                  <th></th>
                  <th>상품이름</th>
                  <th>상품가격</th>
                  <th>상품상태</th>
                  <th>상품할인</th>
                </tr>
                </thead>
                <tbody>
                {
                  searchResult != null ?
                    searchResult.map((res, i) => {
                      return <BoxSearch Search={res} key={i} />
                    })
                    : null
                }
                </tbody>
              </table>

            </div>
            <div className='stock-cotainer'>
              <div className='input-wrap'>
                <div className='input-box' style={{ width: '30%' }}>
                  <p>옵션 1</p>
                  <p><input type='text' style={{ width: '100%' }} value={option1} onChange={(e) => { setOption1(e.target.value) }}></input></p>
                </div>
                <div className='input-box' style={{ width: '30%' }}>
                  <p>옵션 2</p>
                  <p><input type='text' style={{ width: '100%' }} value={option2} onChange={(e) => { setOption2(e.target.value) }}></input></p>
                </div>
                <div className='input-box' style={{ width: '30%' }}>
                  <p>재고</p>
                  <p><input type='text' style={{ width: '100%' }} value={stock} onChange={(e) => { setStock(e.target.value) }}></input></p>
                </div>
                <div>
                  <button className='basic-button' style={{ marginTop: 20 }} onClick={() => { stockAdd() }}>추가</button>
                </div>
              </div>

              <div className='stock-result'>
                <table className='stock-box'>
                  <thead>
                  <tr>
                    <th>상품번호</th>
                    <th>옵션 1</th>
                    <th>옵션 2</th>
                    <th>재고</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    stockResult != null ?
                      stockResult.map((res, i) => {
                        return <BoxSetStock Stock={res} key={i} />
                      })
                      : null
                  }
                  </tbody>
                </table>

              </div>

            </div>
            <div className='button-box'>
              <button onClick={() => { stockSubmit() }}>재고 등록</button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='container'>
            <div style={{ padding: 10 }}>
              <p>상품 검색</p>
              <input type='text' value={searchText} onChange={(e) => { setSearchText(e.target.value) }} /><button className='basic-button' onClick={(e) => { search() }} style={{ marginLeft: 10 }}>검색</button>
            </div>
            <div className='search-result'>
              <table className='search-box'>
                <thead>
                  <tr>
                    <th></th>
                    <th>상품이름</th>
                    <th>상품가격</th>
                    <th>상품상태</th>
                    <th>상품할인</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    searchResult != null ?
                      searchResult.map((res, i) => {
                        return <BoxSetProduct Search={res} key={i} />
                      })
                      : null
                  }
                </tbody>
              </table>

            </div>

            <div style={{ padding: 10, paddingBottom: 0 }}>
              <p>상품명</p>
              <p><input type='text' style={{ width: '100%' }} value={name} onChange={(e) => { setName(e.target.value) }}></input></p>
            </div>
            <div className='img-container'>
              <div className='img-box'>
                {
                  img.img_file != null ?
                    <img src={img.preview_img} width='100%' height='100%' style={{ padding: 10, objectFit: 'contain' }}></img>
                    :
                    <img src={'http://localhost:8080/img/load/' + img.preview_img} width='100%' height='100%' style={{ padding: 10, objectFit: 'contain' }}></img>
                }

              </div>
              <div className='input-container'>
                <div className='input-wrap'>
                  <div className='input-box'>
                    <p>가격</p>
                    <p><input type='number' value={price} onChange={(e) => { setPrice(e.target.value) }}></input></p>
                  </div>
                  <div className='input-box'>
                    <p>카테고리</p>
                    <p><select value={category} onChange={(e) => { setCategory(e.target.value) }}>
                      <option value='top'>top</option>
                      <option value='shirts'>shirts</option>
                      <option value='pants'>pants</option>
                      <option value='outer'>outer</option>
                    </select></p>
                  </div>
                  <div className='input-box'>
                    <p>등록상태</p>
                    <p><select value={status} onChange={(e) => { setStatus(e.target.value) }}>
                      <option value='on'>판매중</option>
                      <option value='off'>품절</option>
                      <option value='out'>판매중지</option>
                    </select></p>
                  </div>
                  <div className='input-box'>
                    <p>할인</p>
                    <p><select value={discount} onChange={(e) => { setDiscount(e.target.value) }}>
                      <option value='0'>없음</option>
                      <option value='5'>5%</option>
                      <option value='10'>10%</option>
                      <option value='15'>15%</option>
                      <option value='20'>20%</option>
                      <option value='50'>50%</option>
                    </select></p>
                  </div>
                </div>

              </div>
            </div>

            <div className='button-box'>
              <input ref={InputImg} type='file' accept='image/*' name='file' onChange={(e) => { previewImg(e) }} style={{ display: 'none' }}></input>
              <button style={{ marginRight: 20 }} onClick={ImgButtonClick}>이미지 등록</button>
              <button style={{ marginRight: 20 }} onClick={deleteImg}>이미지 삭제</button>
              <button style={{ marginRight: 20 }} onClick={() => { updateProduct() }}>상품 수정</button>
              <button onClick={() => { deleteProduct() }}>상품 삭제</button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='container'>
            <div style={{ padding: 10 }}>
              <p>상품 검색</p>
              <input type='text' onChange={(e) => { setSearchText(e.target.value) }} /><button className='basic-button' onClick={(e) => { search() }} style={{ marginLeft: 10 }}>검색</button>
            </div>
            <div className='search-result'>
              <table className='search-box'>
                <thead>
                <tr>
                  <th></th>
                  <th>상품이름</th>
                  <th>상품가격</th>
                  <th>상품상태</th>
                  <th>상품할인</th>
                </tr>
                </thead>
                <tbody>
                {
                  searchResult != null ?
                    searchResult.map((res, i) => {
                      return <BoxGetStock Search={res} key={i} />
                    })
                    : null
                }
                </tbody>
              </table>

            </div>

            <p style={{ marginTop: 10 }}>재고</p>
            <div className='stock-result' style={{ marginBottom: 10 }}>
              <table className='stock-box'>
              <thead>
                <tr>
                  <th></th>
                  <th>상품번호</th>
                  <th>옵션 1</th>
                  <th>옵션 2</th>
                  <th>재고</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {
                  stockResult != null ?
                    stockResult.map((res, i) => {
                      return <BoxEditStock Stock={res} key={i} />
                    })
                    : null
                }
                </tbody>
              </table>
            </div>

          </div>
        )

    }
  }

  function ImgButtonClick() {
    InputImg.current.click();
  }





}

export default Edit
