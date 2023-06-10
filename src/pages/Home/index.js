import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import {
    collection,
    onSnapshot,
    query,
    where
} from "firebase/firestore";

import "./index.css"
import { db, collectionName } from "../../firebase"
import { generateChatMessage } from "../../helpers/useChatGPT"
import Button from "../../components/Button";
import Form from "../../components/Form";
import Navbar from "../../components/Navbar"
import Notification from "../../components/Notification";
import Toolbar from "../../components/Toolbar";
import useTime from '../../helpers/timeUtils'

const Home = () => {
    const notificationRef = useRef(null);
    const navigate = useNavigate();
    const { mealTime } = useTime();


    const [userDataId, setUserDataId] = useState('');
    const [userProducts, setUserProducts] = useState(undefined);
    const [suggesedDish, setSuggesedDish] = useState(undefined);
    const [productsNames, setProductsNames] = useState('');
    const [personsAmount, setPersonsAmount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const prompt = `write 1 dish wich i can cook on ${mealTime} for ${personsAmount} person from this products - ${productsNames}. Write answer in json like {name: 'Avocado Toast', ingredients:'Bread, Avocado ...', instructions: 'Take avocado and bread...'}. And use maximum 3700 characters. `

    const handleSetSuggesedDish = (value) => {
        if (value) setSuggesedDish(value);
    };
    const handleSetUserProducts = (value) => {
        setUserProducts(value);
    };
    const handleSetUserDataId = (value) => {
        setUserDataId(value);
    };
    const handlePersonsAmount = (value) => {
        setPersonsAmount(value);
    };
    const redirectToSuggesedDish = () => {
        navigate('/generateDish', { state: { generatedDish: suggesedDish } });
    }
    const showNotification = () => {
        if (notificationRef.current) {
            notificationRef.current.handlerShowNotification();
        }
    }
    const regenerateSuggesedDish = async () => {
        const chatMessage = prompt + `But not a ${suggesedDish?.name}`;
        setIsLoading(true);
        await generateChatMessage(chatMessage)
            .then((response) => {
                const suggesedDishObject = JSON.parse(response);
                handleSetSuggesedDish(suggesedDishObject);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (localStorage.uid) {
            const q = query(collection(db, collectionName), where('uid', '==', localStorage.uid));
            const unsub = onSnapshot(q, (querySnapshot) => {
                if (querySnapshot.docs[0]) {
                    handleSetUserDataId(querySnapshot.docs[0].id)
                    handleSetUserProducts(querySnapshot.docs[0].data())
                    const productNames = querySnapshot.docs[0].data().products ? querySnapshot.docs[0].data().products
                        .map(product => `${product.name} ${product.amount} ${product.type}`)
                        .join(', ') : '';
                    setProductsNames(productNames)
                    const fetchChatGPTAnswer = async () => {
                        setIsLoading(true)
                        await generateChatMessage(prompt)
                            .then((response) => {
                                const suggesedDishObject = JSON.parse(response);
                                handleSetSuggesedDish(suggesedDishObject)
                                setIsLoading(false)
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    }
                    fetchChatGPTAnswer()
                }
            });
            return () => unsub();
        }
    }, [prompt]);

    return (
        <div className="home page">
            <Navbar />
            <Toolbar options={['time', 'type', 'persons']} getPersonsAmount={handlePersonsAmount} />
            <Notification ref={notificationRef} message="Product Added!" />
            <h4>We suggest you cook:</h4>
            {
                (!isLoading && typeof suggesedDish !== 'undefined')
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
            <Form actionType="add" userProducts={userProducts} userDataId={userDataId} title="Add product" onSubmit={showNotification} />
        </div>
    );
};
export default Home;