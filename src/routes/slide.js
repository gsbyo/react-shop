import { Carousel } from 'react-bootstrap'

function Slide() {
    return (
            <Carousel style={{width:1200, margin:'0 auto'}}>
                <Carousel.Item interval={1500} style={{width:'100%', height:'600px'}}>
                    <img
                        className="w-100"
                        src='./img/banner1.jpg'
                        alt="Image One"
                        style={{height:'auto'}}
                      
                    />
                    <Carousel.Caption>
                        {/* <h3>Label for first slide</h3>
                        <p>Sample Text for Image One</p> */}
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={1500} style={{width:'100%', height:'600px'}}>
                    <img
                        className="w-100"
                        src='./img/banner2.jpg'
                        alt="Image Two"
                        style={{height:'auto'}}
                    
                    />
                    <Carousel.Caption>
                      
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={1500} style={{width:'100%', height:'600px'}}>
                    <img
                        className="w-100"
                        src='./img/banner3.jpg'
                        alt="Image Three"
                        style={{height:'auto'}}
                    />
                        
                    <Carousel.Caption>
                       
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
    )
}


export default Slide;