import { useState,useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet } from "react-router-dom";
import api from "../../api/AxiosInstance";
import Spinner from "../../components/Layout/spinner/Spinner";
// import Spinner from "../spinner/Spinner";


export default function AdminRoutes (){
    const [ok,setOk] = useState(false)
    const [auth,setAuth] = useAuth()

    useEffect(()=>{
        const authCheck = async ()=>{
            const res = await api.get('/api/auth/admin-auth',
            {
                headers:{
                    "Authorization": auth?.token
                }
            })
            if(res.data.ok){
                setOk(true)
            }else{
                setOk(false)
            }
        }
        if(auth?.token) authCheck()
    },[auth?.token])

    return ok ? <Outlet/> : <Spinner path=""/>
}

