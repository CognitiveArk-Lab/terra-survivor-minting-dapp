import React from 'react'
import './success.scss'

const SuccessModal = (props) => {
    if (!props.show) {
        return null
    }
    return (
        <div className='success-body' onClick={() => props.onClose()}>
            Success Connection!
        </div>
    )
}

export default SuccessModal