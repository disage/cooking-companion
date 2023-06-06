import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import {
    addDoc,
    collection,
    doc,
    updateDoc,
} from "firebase/firestore";

import './index.css'
import { db, collectionName } from "../../firebase"
import Button from "../../components/Button";

const Form = ({ actionType, onSubmit, seletedProductIndex, userDataId, userProducts }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [productAmount, setProductAmount] = useState('');
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('Kg');

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };
    const handleProductAmountChange = (e) => {
        setProductAmount(e.target.value);
    };
    const handleSelectProductType = (value) => {
        setProductType(value);
        setIsDropdownOpen(false);
    };
    const onFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (localStorage.uid) {
                if (actionType === 'add') {
                    if (!userProducts) {
                        await addDoc(collection(db, collectionName), {
                            uid: localStorage.uid,
                            products: [{
                                name: productName,
                                amount: productAmount,
                                type: productType
                            }]
                        })
                    } else {
                        await updateDoc(doc(db, collectionName, userDataId), {
                            products: [...userProducts.products, {
                                name: productName,
                                amount: productAmount,
                                type: productType
                            }]
                        });
                    }
                } else {
                    const productToUpdate = userProducts.products[seletedProductIndex]
                    if (productToUpdate) productToUpdate.amount = productAmount;
                    await updateDoc(doc(db, collectionName, userDataId), {
                        products: [...userProducts.products]
                    });
                }
                onSubmit()
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setProductName('');
        setProductAmount('');
    }

    useEffect(() => {
        if (actionType === 'edit') {
            const selectedProductName = userProducts?.products?.[seletedProductIndex]?.name || ''
            const selectedProductAmount = userProducts?.products?.[seletedProductIndex]?.amount || ''
            setProductName(selectedProductName)
            setProductAmount(selectedProductAmount)
        }
    }, [actionType, seletedProductIndex, userProducts?.products]);

    return (
        <form className='form' onSubmit={onFormSubmit}>
            <h3>{actionType === 'add' ? 'Add Product' : `Edit ${productName}`}</h3>
            {actionType === 'add' &&
                <label className='formField'>
                    Name:
                    <input className="productNameInput" type="text" value={productName} onChange={handleProductNameChange} required />
                </label>
            }
            <label className='formField'>
                Amount:
                <div className="formGroup">
                    <input type="number" value={productAmount} onChange={handleProductAmountChange} required />
                    <div className="singleSelect" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {productType}
                        {isDropdownOpen && (
                            <ul className="dropdown">
                                <li onClick={() => handleSelectProductType('Kg')}>Kg</li>
                                <li onClick={() => handleSelectProductType('L')}>L</li>
                                <li onClick={() => handleSelectProductType('Pieces')}>Pieces</li>
                            </ul>
                        )}
                    </div>
                </div>
            </label>
            <Button type="submit" text={actionType === 'add' ? 'Add' : 'Save'} />
            {window.location.pathname === '/home' && <Link to="/products">See my products</Link>}
        </form>
    );
}

export default Form;