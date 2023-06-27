import React, { useState, useEffect, useRef } from 'react'

import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'

import './index.css'
import editIcon from '../../icons/edit-icon.svg'
import { db, collectionName } from '../../firebase'
import FormModal from '../../components/FormModal'
import deleteIcon from '../../icons/delete-icon.svg'
import Navbar from '../../components/Navbar'
import Notification from '../../components/Notification'
import Toolbar from '../../components/Toolbar'

const Products = () => {
  const notificationRef = useRef(null)

  const [seletedProductIndex, setSelectedProductIndex] = useState(undefined)
  const [formActionType, setFormActionType] = useState('add')
  const [userDataId, setUserDataId] = useState('')
  const [userProducts, setUserProducts] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }
  const addProduct = () => {
    setFormActionType('add')
    openModal()
  }
  const removeAllProducts = async () => {
    try {
      await updateDoc(doc(db, collectionName, userDataId), { products: [] })
      showNotification('All products deleted !')
    } catch (error) {
      console.error(error)
    }
  }
  const deleteProduct = async (value) => {
    try {
      const products = userProducts.products.filter((item, index) => index !== value)
      await updateDoc(doc(db, collectionName, userDataId), { products })
      showNotification('Product deleted !')
    } catch (error) {
      console.error(error)
    }
  }
  const editProduct = (index) => {
    setSelectedProductIndex(index)
    setFormActionType('edit')
    openModal()
  }
  const showNotification = (message) => {
    if (notificationRef.current) {
      const notificationMessage = message || (formActionType === 'add' ? 'Product added !' : 'Product edited')
      notificationRef.current.handlerShowNotification(notificationMessage)
    }
    if (formActionType === 'edit') closeModal()
  }

  useEffect(() => {
    const q = query(collection(db, collectionName), where('uid', '==', localStorage.uid))
    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs[0]) {
        setUserProducts(querySnapshot.docs[0].data())
        setUserDataId(querySnapshot.docs[0].id)
      }
    })
    return () => unsub()
  }, [])

  return (
    <div className="page">
      <Navbar />
      <Toolbar options={['add', 'clear']} onAdd={addProduct} onClear={removeAllProducts} />
      <Notification ref={notificationRef} />
      <h4>My Products:</h4>
      <ul className="productsList">
        {userProducts.products &&
          userProducts.products.map((item, index) => (
            <li className="productItem" key={index}>
              <div>
                <img className="deleteIcon" src={deleteIcon} alt="Delete Icon" onClick={() => deleteProduct(index)} />
                <b>{item.name}</b>
                <span>{item.amount + ' ' + item.type}</span>
              </div>
              <img src={editIcon} className="editIcon" onClick={() => editProduct(index)} alt="edit icon" />
            </li>
          ))}
      </ul>
      <FormModal
        isOpen={isModalOpen}
        userDataId={userDataId}
        userProducts={userProducts}
        notificationRef={notificationRef}
        actionType={formActionType}
        seletedProductIndex={seletedProductIndex}
        onFormSubmit={showNotification}
        onClose={closeModal}
      />
    </div>
  )
}

export default Products
