import axios from 'axios'
import React from 'react'

const AddToCart = ({product}) => {
    const handleCart = async () => {
        try {
            const response = await axios.post('/api/cart', {
                productId: product._id,
            })
            alert(response.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <button className="flex-1 bg-gray-600 hover:bg-white/20 transition py-3 rounded-xl font-medium"
                onClick={handleCart}
                type='submit'>
                Add to Cart
            </button>
        </>
    )
}
export default AddToCart