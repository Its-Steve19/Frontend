import React from 'react';
import './loading.css';

const OrderSkeletonLoading = () => {
    return (
        <div className="order-skeleton">
            <div className='double-content'>
                <div>
                    <div className='circle-skeleton'></div>
                </div>
                <div className='skeleton-content'></div>
            </div>
            <div className='skeleton-heading'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>                    
            <div className='skeleton-heading'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className='skeleton-heading'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default OrderSkeletonLoading;
