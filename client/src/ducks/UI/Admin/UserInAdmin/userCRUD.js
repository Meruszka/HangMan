import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import UserList from './userList';
import ip from '../../../../config.js'


function UserCRUD() {
    const [ respond, setRespond ] = useState(null)
    const validInput = Yup.object().shape({
        nick: Yup.string()
            .max(60, 'Za Długi!')
            .required("Wymagane!"),
        password: Yup.string().required('Wymagane!')
        })
    const handleSumbitEdit = async (values) => {
        await axios.put(`http://${ip}:5000/person/${values.id}`, values)
            .then(res => {
                if(res.status === 200){
                    setRespond(`Zmieniono ${values.nick}`)
                }
            })
            .catch(err => console.log(err))
    }
    return(
        <div>
            Edycja oraz usuwanie kont
        <Formik
                onSubmit={(values) => handleSumbitEdit(values)}
                validationSchema={validInput}
                initialValues={{
                    id: '',
                    nick: '',
                    password: ''
                }}>
            {({errors, touched}) => (
                <div>
                    <Form>
                    <div>
                        <span>ID</span>
                        <Field name='id' type='text'/>
                        {(errors.id && touched.id) ? (<div>{errors.id}</div>):(null)}
                    </div>
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
        {respond}
        <UserList/>
        </div>
        )
}

export default UserCRUD;
