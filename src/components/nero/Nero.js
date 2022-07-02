import React, { useState, useEffect, useRef } from 'react';
import './nero.scss'
import styled from 'styled-components';
import ProgressBar from '../progressbar/ProgressBar';

const Nero = ({ setshowblock, moveingblock, setshowblock2, moveingblock2, animation2, setAniShow, itemsRedeemed, itemsAvailable, onPlayClick, mintbtnshow, setBtnShow, onClickMint, isActive, wallet }) => {
  const [mintbtnClick, setClicked] = useState(false);
  const testData = [
    { bgcolor: "#FBEC96", completed: 60 },
  ];
  const [show, setShow] = useState(false)
  const [introShow, setIntroShow] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)
  const [mintNumber, setNumber] = useState(0)

  const [mintbtnClicked, setBtnClicked] = useState(false)

  const onMinus = () => {
    if (mintNumber <= 0) return;
    setNumber(mintNumber - 1);
  }

  const onPlus = () => {
    setNumber(mintNumber + 1);
  }
  let mintNum = 1

  const closeSuccessModal = () => {
    setShow(false)
  }
  useEffect(() => {
    onPlayClick()
  }, [])

  const onClickSign = (increaseNum) => {
    if ((mintAmount + increaseNum) < 1 || (mintAmount + increaseNum) > 10) {
      return
    }
    setMintAmount(mintAmount + increaseNum)
  }

  const btnclick = () => {
    setAniShow(true);

  }

  return (
    <div>
      < div className='neroBody' >
        <div className='neroContainer'>
          <div className='title'>
            <div className='nero-title'>
              TERRAPOCALYPSE SURVIVOR
            </div>
          </div>
          <div className='progress-info'>
            <div className='progress-info-left'>
              GLObally minted
            </div>
            <div className='progress-info-right'>
              {itemsRedeemed}<span style={{ fontSize: '20px' }}>/</span><font style={{ fontSize: '18px', color: '#B860C9' }}>{itemsAvailable}{/*itemsAvailable*/}</font>
            </div>
          </div>
          <div className='progress'>
            <ProgressBar bgcolor="#FBEC96" completed={itemsAvailable > 0 ? itemsRedeemed * 100 / itemsAvailable : 0} />
          </div>
          <div className='countdown'>
            <img src='/assets/clock_icon.png' alt='clcok' />
            <div>
              02 : 16 : 27
            </div>
          </div>
          <div className='desc-title'>
            Description
          </div>
          <div className='desc'>
            Limited 500 NFTs that represent a token of remembrance. A memento for the brave survivor who is still pursuing a meaning of freedom.
            {/* There's no limit to the strength of men. Everyone has a unique way to express this abstract work. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. */}
          </div>

          <div className='info-left-div4'>
            <div className='info-price'>Price</div>
            <div className='info-sol-sign'><img src='/assets/TLSToken.png' alt='price-icon' />1 TLS Token</div>
          </div>
          <div className='nero-bottom'>
            <div className={(animation2 && mintbtnClicked) ? 'mintbtn-active mint-btn' : 'mint-btn defaultcolor'} id='mintbutton' onClick={e => onClickMint()}>
              {!!wallet && !!wallet.publicKey ? (isActive ? <span>MINT</span> : <span className='font15'>You don't have TLS Token in your wallet</span>) : <span>MINT</span>}
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Nero;