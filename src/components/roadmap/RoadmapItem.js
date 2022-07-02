import React, { useState, useEffect } from 'react';
import './roadmap.scss'

const RoadmapItem = (props) => {
    const border = [
        {
            border: '2px solid #7CD7D6',
            boxShadow: '0px 0px 18px 8px #021a3d'
        },
        {
            border: '3px solid #726565',
            boxShadow: '0px 0px 12px 2px #b3a282'
        }
    ]
    return (
        <div className='roadmap-item-body' style={props.order % 2 == 0 ? border[0] : border[1]}>
            <div className='left-item'>
                QZ
            </div>

            <div className='right-item'>
                <div className='right-item-top'>2022</div>
                <div className='right-item-center'>{props.title}</div>
                <div className='right-item-bottom'>{props.desc}</div>
            </div>
        </div>
    )
}

export default RoadmapItem