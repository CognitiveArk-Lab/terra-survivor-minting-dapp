import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import './card.scss';



const CardContainer = styled.div`
  width: 213px;
  background: ${props => props.bg};
  margin: 15px;
  margin-bottom: 50px;
`;

const Card = styled.div`
    &:hover{

      .cardcircle{
        border: 2px solid #A8BF6E;
      }
    .smallcircle{
      background: #7CD7D6;
      border-color: white;
      color: #A8BF6E;
    }
  }
`;

const CardCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 2px solid #FFFFFF;
  border-radius: 20px;
  
`;

const SmallCircle = styled.div`
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border: 2px solid #A8BF6E;
  font-size: 18px;
  line-height: 20px;
`;


const CardText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  line-height: 26px;
  margin: 20px;
`;

const Span = styled.span`
  font-family: 'Poppins';
  font-size: 10px;
  margin: 0px;
  line-height: 15px;
  transition-delay: 0.4s;

`;

const RoadmapCard = (props) => {

  const [hover, setHover] = useState(false);
  const onhover = useRef(0);

  const onHover = () => {
    setHover(true);
    onhover.current.style.background = 'white';
    window.setTimeout(() => {
      onhover.current.style.background = '#7CD7D6'
    }, 40);
  }

  const onLeave = () => {
    setHover(false);
    window.setTimeout(() => {
      onhover.current.style.background = 'linear-gradient(105.79deg, rgba(124, 215, 214, 0.096) -9.83%, rgba(124, 215, 214, 0.04) 29.26%, rgba(124, 215, 214, 0.04) 87.38%)';
    }, 30);
  }

  return (
    <CardContainer id='container' bg={props.bgcolor}>
      <Card id='cardbody' ref={onhover} onMouseEnter={onHover} onMouseLeave={onLeave} className="card">
        <CardCircle className='cardcircle'>
          <SmallCircle className='smallcircle'>{props.idx + 1}</SmallCircle>
        </CardCircle>
        <CardText id='text' className='cardtext'>
          <div style={{ width: '200px', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0px' }}>
            {hover ? <>
              <Span>Lorem ipsum dolor sit amet,</Span>
              <Span>consectetur adipisicing elit,</Span>
              <Span>sed do eiusmod tempor</Span>
              <Span> incididunt ut labore et dolore</Span>
              <Span>magna aliqua.</Span></>
              : <>
                <span>{props.texts[0]}</span>
                <span>{props.texts[1]}</span>
              </>
            }

          </div>
        </CardText>
      </Card>
    </CardContainer>
  )
}
export default RoadmapCard;