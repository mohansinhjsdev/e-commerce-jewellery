import { useState,useEffect } from "react";
import api from "../api/AxiosInstance";


export default function useCategory(){
    const [categories,setCategories] = useState([])

    //get Cat
    const getCategories = async()=>{
        try {
            const {data} = await api.get('/api/category/all-categories')
            console.log("data for getting cat",data.categories)
            setCategories(data?.categories)
        } catch (error) {
            console.log(error)
        }
    }


useEffect(()=>{
    getCategories()
},[])

return categories

}
