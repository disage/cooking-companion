import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { collection, onSnapshot, query, where } from 'firebase/firestore'

import './index.css'
import { db, collectionName } from '../../firebase'
import { generateChatMessage } from '../../helpers/useChatGPT'
import Button from '../../components/Button'
import Form from '../../components/Form'
import Navbar from '../../components/Navbar'
import Notification from '../../components/Notification'
import Toolbar from '../../components/Toolbar'
import useTime from '../../helpers/timeUtils'

const Home = () => {
  const { mealTime } = useTime()
  const navigate = useNavigate()
  const notificationRef = useRef(null)

  const [userDataId, setUserDataId] = useState('')
  const [userProducts, setUserProducts] = useState(undefined)
  const [suggesedDish, setSuggestedDish] = useState([])
  const [productsNames, setProductsNames] = useState('')
  const [personsAmount, setPersonsAmount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingNewDish, setIsLoadingNewDish] = useState(false)

  const prompt = `write 1 dish wich i can cook on ${mealTime} for ${personsAmount} person, use only this products - 
        ${productsNames}. Write answer in json like {"name":"Avocado Toast","ingredients":"Bread, Avocado ...",
        "instructions":"Take avocado and bread..."}. And use maximum 3700 characters. `

  const handleSetSuggesedDish = (value) => {
    if (value) setSuggestedDish([...suggesedDish, value])
  }
  const removeSuggesedDish = (index) => {
    const updatedDishes = suggesedDish.filter((_, i) => i !== index)
    setSuggestedDish(updatedDishes)
  }
  const handleSetUserProducts = (value) => {
    setUserProducts(value)
  }
  const handleSetUserDataId = (value) => {
    setUserDataId(value)
  }
  const handlePersonsAmount = (value) => {
    setSuggestedDish([])
    setPersonsAmount(value)
  }
  const redirectToSuggesedDish = (index) => {
    navigate('/generateDish', { state: { generatedDish: suggesedDish[index] } })
  }
  const showNotification = (message) => {
    if (notificationRef.current) {
      notificationRef.current.handlerShowNotification(message)
    }
  }
  const generateNewDish = async () => {
    if (suggesedDish.length < 6) {
      const dishNames = suggesedDish.map((dish) => dish.name)
      const chatMessage = prompt + `But not a ${dishNames.join(', ')}`
      setIsLoadingNewDish(true)
      await generateChatMessage(chatMessage)
        .then((response) => {
          try {
            const suggesedDishObject = JSON.parse(response)
            handleSetSuggesedDish(suggesedDishObject)
          } catch (error) {
            showNotification('A lot of requests. Wait 20s !')
            console.error('Error:', error)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
        .finally(() => {
          setIsLoadingNewDish(false)
        })
    }
  }

  useEffect(() => {
    if (localStorage.uid) {
      const q = query(collection(db, collectionName), where('uid', '==', localStorage.uid))
      const unsub = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.docs[0]) {
          handleSetUserDataId(querySnapshot.docs[0].id)
          handleSetUserProducts(querySnapshot.docs[0].data())
          const productNames = querySnapshot.docs[0].data().products
            ? querySnapshot.docs[0]
                .data()
                .products.map((product) => `${product.name} ${product.amount} ${product.type}`)
                .join(', ')
            : ''
          setProductsNames(productNames)
          const fetchChatGPTAnswer = async () => {
            setIsLoading(true)
            const callGenerateChatMessage = async () => {
              await generateChatMessage(prompt).then((response) => {
                if (response === null) {
                  setTimeout(callGenerateChatMessage, 10000)
                } else {
                  try {
                    const suggesedDishObject = JSON.parse(response)
                    handleSetSuggesedDish(suggesedDishObject)
                    setIsLoading(false)
                  } catch (error) {
                    setTimeout(callGenerateChatMessage, 10000)
                    showNotification('Hmm... Something went wrong')
                    console.error('Error parsing JSON:', error)
                  }
                }
              })
            }
            callGenerateChatMessage()
          }
          if (productsNames) fetchChatGPTAnswer()
        }
      })
      return () => unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, productsNames])

  return (
    <div className="home page">
      <Navbar />
      <Toolbar options={['time', 'type', 'persons']} getPersonsAmount={handlePersonsAmount} />
      <Notification ref={notificationRef} />
      <h4>We suggest you cook:</h4>
      {!isLoading && suggesedDish !== [] ? (
        suggesedDish.map((item, index) => (
          <div key={index} className="suggesedDish">
            <h3>{item.name}</h3>
            <span>Ingredients:</span>
            <p className="suggesedDishDescription">{item.ingredients}</p>
            <div className="actions">
              {suggesedDish.length > 1 && (
                <Button
                  type="button"
                  text="Remove"
                  btnStyle="secondary"
                  onButtonClick={() => removeSuggesedDish(index)}
                />
              )}
              <Button type="button" text="Read More" onButtonClick={() => redirectToSuggesedDish(index)} />
            </div>
          </div>
        ))
      ) : (
        <div className="suggesedDish">
          <h4>
            {userProducts?.products?.length === 0 ? 'You should add some products' : 'We are generate your dish ...'}
          </h4>
        </div>
      )}
      {isLoadingNewDish && (
        <div className="suggesedDish">
          <h4>{'We are generate your dish ...'}</h4>
        </div>
      )}
      {!isLoadingNewDish && !isLoading && (
        <Button type="button" text="Generate New Dish" btnStyle="secondary" onButtonClick={generateNewDish} />
      )}
      <Form
        actionType="add"
        userProducts={userProducts}
        userDataId={userDataId}
        title="Add product"
        onSubmit={() => showNotification('Product Added!')}
      />
    </div>
  )
}
export default Home
