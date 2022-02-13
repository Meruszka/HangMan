import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import ip from '../../../config.js';


const axios = require('axios');

function UserAdd() {
  const [error, setError] = useState('')
  const validInput = Yup.object().shape({
    nick: Yup.string()
        .max(60, 'Za Długi!')
        .required("Wymagane!"),
    password: Yup.string().required('Wymagane!')
  })
  const history = useHistory()
  const handleSumbit = async (values) => {
    const gameid = await axios.get(`http://${ip}:5000/games`)
    await axios.post(`http://${ip}:5000/person`, values)
        .then(res => {
            if(res.status === 200){
                Cookies.set('username', values.nick)
                history.push(`/game/${gameid.data.gameid}`)
            }
            if(res.status === 201){
                Cookies.set('username', values.nick)
                history.push(`/game/${gameid.data.gameid}`)
            }
        })
        .catch(() => setError('Nick zajęty'))

  }
  const LoggedInGame = async () => {
      useEffect(() => {
        axios.get(`http://${ip}:5000/games`).then(res => {
            history.push({
                pathname: `/game/${res.data.gameid}`,
                state: res.data})
        })
      }, [])
  }
    if(Cookies.get('username')){
        LoggedInGame()
        return(
            <div>
                SIEMA
            </div>
        )
    }else{
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
                    <button type="submit">Graj</button>
                    </Form>
                </div>
            )}
            </Formik>
            </div>
            )   
    }
}

export default UserAdd;
