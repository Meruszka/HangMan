import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import WordAdd from './WordInAdmin/wordAdd'
import UserCRUD from './UserInAdmin/userCRUD';
import ip from '../../../config.js';


function AdminPanel() {
    const validInput = Yup.object().shape({
    nick: Yup.string()
        .max(60, 'Za Długi!')
        .required("Wymagane!"),
    password: Yup.string().required('Wymagane!')
    })
    const handleSumbitLogin = async (values) => {
        await axios.post(`http://${ip}:5000/person`, values)
            .then(res => {
                if(res.status === 200){
                    Cookies.set('username', values.nick)
                    window.location.reload()
                }
                if(res.status === 201){
                    Cookies.set('username', values.nick)
                    window.location.reload()
                }
            })
            .catch((err) => console.log(err))
    }
    if(Cookies.get('username') !== 'admin'){
        return(
            <div>
            <Link to={'/'}>
            <button>
                Główna
            </button>
            </Link>
            <Formik
                onSubmit={(values) => handleSumbitLogin(values)}
                validationSchema={validInput}
                initialValues={{
                    nick: '',
                    password: ''
                }}>
            {({errors, touched}) => (
                <div>
                    <Form>
                    <div>
                        <span>Nick</span>
                        <Field name='nick' type='text'/>
                        {(errors.nick && touched.nick) ? (<div>{errors.nick}</div>):(null)}
                    </div>
                    <div>
                        <span>Hasło</span>
                        <Field name='password' type='password'/>
                        {(errors.password && touched.password) ? (<div>{errors.password}</div>):null}
                    </div>
                    <button type="submit">Zaloguj</button>
                    </Form>
                </div>
            )}
            </Formik>
            </div>
            )
    }else{
        return(
            <div>
                <WordAdd/>
                <UserCRUD/>
            </div>
        )
    }
}

export default AdminPanel;
