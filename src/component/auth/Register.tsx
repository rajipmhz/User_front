

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import type { register } from "../type/Type";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema=yup.object({
    firstname:yup.string().required("FistName is required"),
    lastname:yup.string().required("lastname is require"),
    email:yup.string().email("Invailds email").required("Enter you email"),
    password:yup.string().required("Enter your password"),
    address:yup.string().required("Address is required"),
    phonenumber:yup.string()
  .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
  .required("Phone number is required"),
    type:yup.string().required("Select type"),
})


function Register()
{
    const queryClient=useQueryClient();
    const navigate=useNavigate();
const mutation=useMutation({
    mutationFn:async(data:register)=>{
     const respone=await axios.post('https://user-back-y4pl.onrender.com/auth/signup',data);
     return respone.data;},
    onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:['users']})
    }
})
const {register,handleSubmit,reset,formState:{errors}} =useForm({
        resolver:yupResolver(schema),
    })

const onSubmit=(data:register)=>{
mutation.mutate({...data});
reset();
navigate("/list");
}

return(
    <div className="min-h-screen bg-gray-300">
    <div className="flex items-center justify-center py-12 px-4">
        <form 
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl w-full p-6 bg-white rounded-lg shadow space-y-4"
        >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register User</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">firstname:</label>
                  <input  {...register('firstname')} placeholder="firstname"
                     className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.firstname?.message}</p>
               </div>
                  <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">lastname:</label>
                  <input {...register('lastname')} placeholder="lastname" className="border  border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.lastname?.message}</p>
                  </div>
                  <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Email:</label>
                  <input {...register('email')} placeholder="Email" className="border  border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p>
                  </div>
                   <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Password:</label>
                  <input type="password" {...register('password')} placeholder="Password" className="border  border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.password?.message}</p>
                  </div>
                   <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Address:</label>
                  <input {...register('address')} placeholder="Password" className="border  border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.address?.message}</p>
                  </div>
                  <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">phonenumber:</label>
                  <input {...register('phonenumber')} placeholder="phonenumber" maxLength={10} className="border  border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700" />
                  <p className="text-xs text-red-500 mt-1">{errors.phonenumber?.message}</p>
                  </div>
                     <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-1">Type:</label>
                  <select {...register('type')} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
                     <option value="">Select User</option>
                     <option value="vendor">vendor</option>
                     <option value="customer">customer</option>
                  </select>
                  <p className="text-xs text-red-500 mt-1">{errors.type?.message}</p>
                  </div>
            </div>
            <div className=" flex justify-center">
                  <button type="submit" className=" bg-blue-600  text-white py-4 px-4 mx-4 rounded-full text-sm font-semibold hover:bg-blue-500 ">Register</button>
            </div> 
        </form>
        </div>
    </div>
)

}

export default Register;