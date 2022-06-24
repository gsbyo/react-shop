# react-shop ( react / node.js / mongodb )

<p> 로그인 / 관리자 페이지 / 장바구니 / 상품 상세 정보 / 상품 리스트 정도만 구현되어 있습니다. ( 회원가입 - 상품 결제 시스템 등 구현되지 않음 ) </p>

- 로그인<br />
  - 관리자와 일반 유저를 나누기 위해서 User Schema의 role column을 추가함. 
  - passport로 세션 쿠키를 할당을 받게 되면 요청에 따라서 해당 사용자의 세션을 체크 한 다음 유효할 경우 받아온 role을 부여하며, 로그인 유지를 위해서 localStorage에 아이디가 남아있는 경우 세션 쿠키를 체크하게 되며 세션이 유효할 경우 로그인 처리를 함. 
  
  ![권한설정](https://user-images.githubusercontent.com/82531576/175319026-b9ab9c07-4970-4564-bb0c-6c2007a91423.PNG)

- 관리자 페이지<br />
  - 상품 - 재고에 관하여 등록 / 수정 / 삭제 기능을 담고 있음.  
  - props로 받은 Role를 통해서 페이지 접근 권한이 없거나 일반 유저인 경우에는 찾을 수 없다는 페이지를 출력
  
  ![권한접근](https://user-images.githubusercontent.com/82531576/175322085-8ae235a2-928d-435e-99f6-ff1f7454169d.PNG)
  
 - 상품 상세 정보 <br />
   - 현재는 상품의 가격, 이미지만 보임. (추가적으로 상품내용을 담고 있는 테이블을 만들어 게시판 형식처럼 에디터를 사용하여 내용을 등록 한 다음에 불러오는 작업이 필요함)
   - 관리자 페이지에서 옵션 1과 옵션 2를 추가 할 수 있음. 옵션을 기입하지 않고 재고를 등록할 경우 'none' 으로 설정 됨. 상품의 갯수를 입력 할 때 해당 옵션의 재고를 체크하여 재고 이상의 값을 입력 할 수 없게 설정함.
   
   ![detail](https://user-images.githubusercontent.com/82531576/175334908-5cb66048-ba53-411d-bf13-14724be75ec6.PNG)
   
 - 상품 리스트<br />
    - axios get에서 URL Parameter에 따라서 데이터를 가져오며, 페이징의 경우 IntersectionObserver을 사용하여 target이 되는 div를 설정 한 후 무한 스크롤의 방식으로 구현하였음. 
    - (loading - end) state를 활용하여 axios의 로딩이미지가 작동되거나 불러올 데이터가 더 이상 없을 때 작동되지 않게 함.
  
  ![스크롤페이징](https://user-images.githubusercontent.com/82531576/175324159-cc925d36-19a3-485d-98d1-25fa537c5dad.PNG)

  ![list](https://user-images.githubusercontent.com/82531576/175334826-2e99ed8a-acca-4830-b9cb-81e1a7838ad4.PNG)

 - 장바구니<br />
   - sessionStorage를 사용하여 구현하였으며, Redux Toolkit을 사용하는 것도 괜찮다고 생각 함. (추가적으로 비로그인에서 로그인으로 넘어 갈 때 장바구니에 있는 정보를 장바구니 테이블로 옮기는 작업이 필요함)  
   - 체크박스를 활용하여 선택한 상품만 결제 할 수 있도록 <br /> cart / checkCart 로 나누었으며, cart의 경우 sessionStoage에 담겨져 있는 상품 정보가 들어가며 checkCart의 경우 체크 된 상품의 정보만 들어가게 됨.
   
   ![카트](https://user-images.githubusercontent.com/82531576/175326855-852ee162-6aa5-434d-af9b-f2da19b3708d.PNG)

   ![cart](https://user-images.githubusercontent.com/82531576/175334866-84f02f0f-036d-4289-afca-24b235ab2742.PNG)   
