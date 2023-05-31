import React, { useEffect, useState, useRef } from "react";

import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where
} from "firebase/firestore";

import "./index.css"
import { db, collectionName } from "../../firebase"
import Button from "../../components/Button";
import Navbar from "../../components/Navbar"
import Toolbar from "../../components/Toolbar";
import Notification from "../../components/Notification";
import { generateChatMessage } from "../../helpers/useChatGPT"
import useTime from '../../helpers/timeUtils'

const Home = () => {
    const notificationRef = useRef(null);
    const { mealTime } = useTime();

    const [productName, setProductName] = useState('');
    const [productAmount, setProductAmount] = useState('');
    const [productType, setProductType] = useState('Kg');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [userDataId, setUserDataId] = useState('');
    const [suggesedDish, setSuggesedDish] = useState(undefined);


    const handleSelectProductType = (value) => {
        setProductType(value);
        setIsDropdownOpen(false);
    };
    const handleSetSuggesedDish = (value) => {
        setSuggesedDish(value)
    };
    const addProductItem = async (e) => {
        e.preventDefault();
        try {
            if (localStorage.uid) {
                if (userProducts.products && userProducts.products.length > 0) {
                    await updateDoc(doc(db, collectionName, userDataId), {
                        products: [...userProducts.products, {
                            name: productName,
                            amount: productAmount,
                            type: productType
                        }]
                    });
                } else {
                    await addDoc(collection(db, collectionName), {
                        uid: localStorage.uid,
                        products: [{
                            name: productName,
                            amount: productAmount,
                            type: productType
                        }]
                    })
                };
                if (notificationRef.current) {
                    notificationRef.current.handlerShowNotification();
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setProductName('');
        setProductAmount('');
    }
    const redirectToSuggesedDish = () => {
        console.log('redirectToSuggesedDish')
    }
    const regenerateSuggesedDish = () => {
        console.log('regenerateSuggesedDish')
    }
    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };
    const handleProductAmountChange = (e) => {
        setProductAmount(e.target.value);
    };
    const handleSetUserProducts = (value) => {
        setUserProducts(value);
    };
    const handleSetUserDataId = (value) => {
        setUserDataId(value);
    };

    useEffect(() => {
        const q = query(collection(db, collectionName), where('uid', '==', localStorage.uid));
        const unsub = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.docs[0]) {
                handleSetUserDataId(querySnapshot.docs[0].id)
                handleSetUserProducts(querySnapshot.docs[0].data())
                const productNames = querySnapshot.docs[0].data().products
                    .map(product => `${product.name} ${product.amount} ${product.type}`)
                    .join(', ');
                const prompt = `write 1 dish wich i can cook on ${mealTime} for 2 person from this products - ${productNames}. Write answer in json like {name: 'Avocado Toast', ingredients:'Bread, Avocado ...', instructions: 'Take avocado and bread...'}. And use maximum 3700 characters`
                const fetchChatGPTAnswer = async () => {
                    await generateChatMessage(prompt)
                        .then((response) => {
                            const suggesedDishObject = JSON.parse(response);
                            handleSetSuggesedDish(suggesedDishObject)
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
                fetchChatGPTAnswer()
            }
        });
        return () => unsub();
    }, []);

    return (
        <div className="home page">
            <Navbar />
            <Toolbar options={['time', 'type', 'persons']} />
            <Notification ref={notificationRef} message="Product Added!" />
            <h4>We suggest you cook:</h4>
            {
                typeof suggesedDish !== 'undefined'
                    ?
                    <div className="suggesedDish">
                        <h3>{suggesedDish.name}</h3>
                        <span>Ingredients:</span>
                        <p className="suggesedDishDescription">
                            {suggesedDish.ingredients}
                        </p>
                        <div className="actions">
                            <Button type="button" text="Regenerate" btnStyle="secondary" onButtonClick={regenerateSuggesedDish} />
                            <Button type="button" text="Read More" onButtonClick={redirectToSuggesedDish} />
                        </div>
                    </div> :
                    <div className="suggesedDish">
                        <h4>We are generate your dish ...</h4>
                    </div>
            }
            <h4>Bought new products?</h4>
            <div className="addProductContainer">
                <form className='addProductForm' onSubmit={addProductItem}>
                    <h3>Add product</h3>
                    <label className='addProductField'>
                        Name:
                        <input className="productNameInput" type="text" value={productName} onChange={handleProductNameChange} required />
                    </label>
                    <label className='addProductField'>
                        Amount:
                        <div className="addProductsInputs">
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
                    <Button type="submit" text="Add" />
                    <Button type="button" text="See my products" btnStyle="secondary" />
                </form>
            </div>
        </div>
    );
};
export default Home;