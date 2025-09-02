import { useState,useContext, createContext, useEffect } from "react";


const CartContext = createContext()

const CartProvider = ({children}) =>{
    const [cart,setCart] = useState([])
   
    useEffect(()=>{
        let existigCartItem = localStorage.getItem('cart')
        if(existigCartItem) setCart(JSON.parse(existigCartItem))
    },[])

    return (
        <CartContext.Provider value={[cart,setCart]}>
            {children}
        </CartContext.Provider>
    )
}

//custom hook
const useCart = ()=>useContext(CartContext)

export { useCart, CartProvider };

