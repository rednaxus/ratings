import React, { Component } from 'react'
import Carousel from 'nuka-carousel'

class Availability extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    let a = Array(8).fill().map((_, i) => i * i)
    console.log('a',a)
    this.state = { slideIndex: 0 }
  }
  mixins: [Carousel.ControllerMixin]
  
  //getInitialState() { return { slideIndex: 0 }; }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Availability for rounds</h1>
            <p><strong>Schedule your availability <span style={{color:"green"}}>{/*this.props.authData.name*/}</span> for coming ratings rounds!</strong> </p>
            <div className="availability-carousel">
              <Carousel 
                slidesToShow={3} 
                cellSpacing={1}
                initialSlideHeight={150}
                initialSlidewidth={200} 
                framePadding="20px"
                cellAlign="left" 
                ref="carousel"
                slideIndex={this.state.slideIndex}
                afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
              >
                {Array(8).fill().map((_, i) => (
                  <div className="availability-container" key={i} >
                    <div>Week of Jan 1{i*7}</div>
                    <div>Survey due Jan 1{(i+1)*7}</div>
                    <br/>
                    <div>Serve as:</div>
                    <div className="btn-group" style={{textAlign:"center"}} role="group" aria-label="..." >
                      <button type="button" className="btn btn-default">Lead</button>
                      <button type="button" className="btn btn-default">Jurist</button>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
            <h3>Tokens Covered</h3>
          </div>
        </div>
      </main>
    )
  }
}

export default Availability
//               slideIndex={this.state.slideIndex}

//                afterSlide={newSlideIndex => this.setState({ slideIndex: newSlideIndex })}
