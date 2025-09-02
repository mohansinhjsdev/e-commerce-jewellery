    import React from 'react'
    import api from '../../api/AxiosInstance'
    import { useNavigate } from 'react-router-dom'
    import { useSearch } from '../../context/Search'

    const SearchInput = () => {

        const [values,setValues] = useSearch()
        const navigate = useNavigate()

        const handleSubmit = async(e)=>{
            e.preventDefault()
            try {
                const {data} = await api.get(`api/product/search/${values.keyword}`)
                console.log("data",data)
                setValues({...values,results:data})
                navigate('/search')
            } catch (error) {
                console.log(error)
            }
        }
    return (
        
                <form 
                className='flex flex-1 max-w-md mx-4'
                onSubmit={handleSubmit}>
                    <input
                type="text"
                placeholder="Search products..."
                className="w-40 md:w-60 lg:w-72 p-2 pl-3 text-sm rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={values.keyword}
                onChange={(e)=>setValues({...values,keyword:e.target.value})}
                />
                <button 
                type='submit'
                className='bg-yellow-500 text-white px-4 rounded-r-lg hover:bg-yellow-600 transition cursor-pointer'>
                    Search
                </button>
                </form>
            
    )
    }

    export default SearchInput
