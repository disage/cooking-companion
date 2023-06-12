import React, { useState, useEffect, useRef } from 'react';

import {
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where
} from "firebase/firestore";

import './index.css'
import { db, collectionName } from "../../firebase"
import FormModal from "../../components/FormModal";
import Navbar from "../../components/Navbar"
import Notification from "../../components/Notification";
import Toolbar from "../../components/Toolbar";

const Products = () => {
    const notificationRef = useRef(null);

    const [seletedProductIndex, setSelectedProductIndex] = useState(undefined);
    const [formActionType, setFormActionType] = useState('add');
    const [userDataId, setUserDataId] = useState('');
    const [userProducts, setUserProducts] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const addProduct = () => {
        setFormActionType('add');
        openModal();
    }
    const removeAllProducts = async () => {
        try {
            await updateDoc(doc(db, collectionName, userDataId), { products: [] });
            showNotification('All products deleted !');
        } catch (error) {
            console.error(error);
        }
    }
    const deleteProduct = async (value) => {
        try {
            const products = userProducts.products.filter((item, index) => index !== value);
            await updateDoc(doc(db, collectionName, userDataId), { products });
            showNotification('Product deleted !');
        } catch (error) {
            console.error(error);
        }
    }
    const editProduct = (index) => {
        setSelectedProductIndex(index);
        setFormActionType('edit');
        openModal()
    }
    const showNotification = (message) => {
        if (notificationRef.current) {
            const notificationMessage = message ? message : formActionType === 'add' ? 'Product added !' : 'Product edited';
            notificationRef.current.handlerShowNotification(notificationMessage);
        }
        if (formActionType === 'edit') closeModal();
    }

    useEffect(() => {
        const q = query(collection(db, collectionName), where('uid', '==', localStorage.uid));
        const unsub = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.docs[0]) {
                setUserProducts(querySnapshot.docs[0].data());
                setUserDataId(querySnapshot.docs[0].id);
            }
        });
        return () => unsub();
    }, []);

    return (
        <div className='page'>
            <Navbar />
            <Toolbar options={['add', 'clear']} onAdd={addProduct} onClear={removeAllProducts} />
            <Notification ref={notificationRef} />
            <h4>My Products:</h4>
            <ul className="productsList">
                {userProducts.products && userProducts.products.map((item, index) => (
                    <li className='productItem' key={index}>
                        <div><svg className='deleteIcon' onClick={() => deleteProduct(index)} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.50006 11V16.5556" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13.4999 11V16.5556" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1 5.44446H21" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.49994 8.77777V17.6667C3.49994 19.5077 5.17888 21 7.24994 21H14.7499C16.8211 21 18.4999 19.5077 18.4999 17.6667V8.77777" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.25012 3.22222C7.25012 1.99492 8.36941 1 9.75012 1H12.2501C13.6309 1 14.7501 1.99492 14.7501 3.22222V5.44444H7.25012V3.22222Z" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                            <b>{item.name}</b><span>{item.amount + ' ' + item.type}</span></div>
                        <svg className='editIcon' onClick={() => editProduct(index)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.239 5.14146L1 14.3805V19H5.61952L14.8586 9.76096M10.239 5.14146L13.5519 1.82851L13.554 1.82654C14.01 1.3705 14.2384 1.14208 14.5017 1.05653C14.7337 0.981158 14.9835 0.981158 15.2155 1.05653C15.4786 1.14202 15.7068 1.37018 16.1622 1.82557L18.1714 3.83483C18.6288 4.29219 18.8576 4.52097 18.9433 4.78466C19.0187 5.01661 19.0186 5.26646 18.9433 5.49841C18.8577 5.76191 18.6292 5.99035 18.1725 6.44704L18.1714 6.44803L14.8586 9.76096M10.239 5.14146L14.8586 9.76096" stroke="#332D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </li>
                ))}
            </ul>
            <FormModal isOpen={isModalOpen} userDataId={userDataId} userProducts={userProducts} notificationRef={notificationRef} actionType={formActionType} seletedProductIndex={seletedProductIndex} onFormSubmit={showNotification} onClose={closeModal} />
        </div>
    );
};

export default Products;
