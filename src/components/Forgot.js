import React, { useState, useEffect } from 'react';
import { Form, Field, Formik } from 'formik';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {ResetNavbar} from './Navbar';
import {ResetSpinner} from '../utils/index';
import {useHistory} from 'react-router-dom';

export const Forgot = () => {
    let [err, setErr] = useState(null);
    let [success, setSuccess] = useState(null);
    let [load, setLoad] = useState(false);
    const handleSubmit = async (values) => {
        try {
            setLoad(true);
            let response = await axios.post('https://api.fileseat.com/api/v1/users/resetpassword', values, { headers: { Accept: "application/json" } })
            // console.log(response);
            setSuccess(response.data.message);
            setLoad(false);
            // setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            if (err.response) {
                setLoad(false);
                setErr(err.response.data.message);
                setTimeout(() => setErr(null), 4000);
            } else {
                setLoad(false);
                setErr('Unable to connect to reset password server');
                setTimeout(() => setErr(null), 4000);
            }
        }
    }
    return (
        <div className='bg-gray-200 h-screen'>
            <div className='p-10'>
                <ResetNavbar />
            </div>
            <div className='m-auto sm:w-1/3 w-full p-8 sm:inset-0'>
                <div className='my-10'>
                    {
                        err ? <div className='text-sm bg-red-100 rounded rounded-sm py-1 text-center text-red-500 border-red-300'>{err}</div> : null
                    }
                    {
                        success ? <div className='text-sm bg-blue-100 rounded rounded-sm py-1 text-center text-blue-500 border-blue-300'>{success}</div> : null
                    }
                </div>
                <Formik
                    initialValues={{
                        email: ''
                    }}
                    onSubmit={handleSubmit}
                >
                    {
                        () =>
                            <Form className='w-full bg-white mx-auto p-8 mt-5 rounded-lg'>
                                    {
                                        success ? (null) : (
                                        <div className='text-sm mb-4 font-semibold text-center'>
                                            Fill in the email for your account. Password reset instructions will be sent to your email in real time.
                                        </div>                                          
                                        )
                                    }
                                <div>
                                    <label className='block text-black font-bold uppercase text-sm'>Email</label>
                                    <Field className='w-full rounded rounded-sm p-2 my-2 border border-gray-400' type='email' name='email' placeholder='e.g johnjude@gm.com' />
                                </div>
                                <button type='submit' className='bg-purple-700 my-4 focus:outline-none hover:bg-purple-500 w-full font-bold text-white rounded rounded-lg py-2'>
                                    {
                                    load ?  <span>Sending mail... <ResetSpinner/> </span>
                                    : <span>Reset Password <i className="fas text-2xl  text-white fa-street-view"></i></span>
                                }</button>
                            </Form>
                    }
                </Formik>
            </div>
        </div>
    )
}

export const Reset = () => {
    let [err, setErr] = useState(null);
    let [success, setSuccess] = useState(null);
    let [email, setEmail] = useState('');
    let [load, setLoad] = useState(false);
    let { id } = useParams();
    // console.log(id + " in the component");
    const history = useHistory()
    const handleSubmit = async (values) => {
        try {
            setLoad(true);
            let response = await axios.post(`https://api.fileseat.com/api/v1/users/resetpassword/${id}`, values, { headers: { Accept: "application/json" } })
            // console.log(response);
            setSuccess(response.data.message);
            setLoad(false);
            setTimeout(()=> history.push('/auth'), 5000);
        } catch (err) {
            if (err.response) {
                setErr(err.response.data.message);
                setLoad(false);
                setTimeout(() => setErr(null), 4000);
            } else {
                setErr('Unable to connect to reset password server');
                setLoad(false);
                setTimeout(() => setErr(null), 4000)
            }
        }
    }

    useEffect(
        () => { 
            (async () => {
            try {
                let response = await axios.get(`https://api.fileseat.com/api/v1/users/resetpassword/${id}`);
                // console.log(response);
                setEmail(response.data.email);
                setSuccess(response.data.message + '. Fill in your new password');

            } catch (err) {
                if (err.response) {
                    setErr(err.response.data.message);
                    // setTimeout(() => setErr(null), 4000)
                } else {
                    setErr('There were issues connecting with backend server!')
                }
            }
        })() }, [id]
    )

    return (
        <div className='bg-gray-200 h-screen flex'>
            <div className='w-full mx-10 my-4 sm:m-auto'>
                <div className='sm:px-20'>
                    <ResetNavbar />
                </div>
                {
                    err ? <div className='text-sm mx-auto bg-red-100 sm:w-1/3 rounded rounded-sm py-1 text-center text-red-500 border-red-300'>{err}</div> : null
                }
                {
                    success ? <div className='text-sm mx-auto bg-blue-100 sm:w-1/3 rounded rounded-sm py-1 text-center text-blue-500 border-blue-300'>{success}</div> : null
                }
                <Formik
                    initialValues={{
                        email:  ''
                    }}
                    onSubmit={handleSubmit}
                >
                    {
                        () =>
                            <Form className='w-full sm:w-1/3 bg-white mx-auto p-8 my-8  rounded-lg'>
                                <div className='my-2'>
                                    <label className='block text-black font-bold uppercase text-sm'>Email</label>
                                    <Field className='w-full rounded  rounded-sm p-2 my-2 border border-gray-400' type='email' value={email} name='email' placeholder='e.g johnjude@gm.com' />
                                </div>
                                <div className='my-2'>
                                    <label className='block text-black font-bold uppercase text-sm'>New Password</label>
                                    <Field className='w-full rounded rounded-sm p-2 my-2 border border-gray-400' type='password' name='password' placeholder='e.g. **********' />
                                </div>
                                <div>
                                    <label className='block text-black font-bold uppercase text-sm'>Confirm New Password</label>
                                    <Field className='w-full rounded rounded-sm p-2 my-2 border border-gray-400' type='password' name='confirmPassword' placeholder='e.g. **********' />
                                </div>
                                <button type='submit' className='bg-purple-700 focus:outline-none my-4 hover:bg-purple-500 w-full font-bold text-white rounded rounded-lg py-2'>
                                {
                                    load ? 
                                    <span>Setting password... <ResetSpinner/></span>
                                    : 
                                    <span>Set New Password<i className="fas text-2xl  text-white fa-street-view"></i></span>
                                }
                                </button>
                            </Form>
                    }
                </Formik>
            </div>
        </div>
    )
}