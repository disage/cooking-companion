import React from 'react';

import './index.css'
import Form from '../Form'

const FormModal = ({ actionType, isOpen, onClose, onFormSubmit, seletedProductIndex, title, userDataId, userProducts }) => {
    return (
        <>
            {isOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <span className="closeMenuIcon" onClick={onClose}>X</span>
                        <Form className="form" actionType={actionType} userProducts={userProducts} userDataId={userDataId} title={title} seletedProductIndex={seletedProductIndex} onSubmit={onFormSubmit} />
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;
