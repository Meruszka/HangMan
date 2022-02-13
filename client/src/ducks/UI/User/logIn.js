import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import Cookies from 'js-cookie';
import ip from '../../../config.js';

const axios = require('axios');

function LogIn() {
  const [error, setError] = useState('')
  const validInput = Yup.object().shape({
    nick: Yup.string()
        .max(60, 'Za Długi!')
        .required("Wymagane!"),

    password: Yup.string().required('Wymagane!')
  })
  const history = useHistory()
  const handleSumbit = async (values) => {
    await axios.post(`http://${ip}:5000/person`, values)
        .then(res => {
            if(res.status === 200){
                Cookies.set('username', values.nick)
                history.push('/')
            }
            if(res.status === 201){
                Cookies.set('username', values.nick)
                history.push('/')
            }
        })
        .catch(() => setError('Nick zajęty'))

  }
    return(
    <div>
    <Link to={'/'}>
    <button>
        Główna
    </button>
    </Link>
    <Formik
        onSubmit={(values) => handleSumbit(values)}
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
                {(errors.nick && touched.nick) ? (<div className="error">{errors.nick}</div>):(<div>{error}</div>)}
            </div>
            <div>
                <span>Hasło</span>
                <Field name='password' type='password'/>
                {(errors.password && touched.password) ? (<div className="error">{errors.password}</div>):null}
            </div>
            <button type="submit">Zaloguj</button>
            </Form>
        </div>
    )}
    </Formik>
    </div>
    )   
}

export default LogIn;
