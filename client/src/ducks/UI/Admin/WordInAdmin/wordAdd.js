import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import WordList from './wordList';
import ip from '../../../../config.js'


function WordAdd() {
    const [ respond, setRespond ] = useState(null)
    const validInput = Yup.object().shape({
    text: Yup.string()
        .max(60, 'Za Długi!')
        .required("Wymagane!"),
    })
    const handleSumbitWord = async (values) => {
        await axios.post(`http://${ip}:5000/word`, values)
            .then(res => {
                if(res.status === 200){
                    setRespond(`Dodano ${values.text}`)
                }
            })
            .catch(err => console.log(err))
    }
    return(
        <div>
        <Formik
            onSubmit={(values) => handleSumbitWord(values)}
            validationSchema={validInput}
            initialValues={{
                text: ''
            }}>
        {({errors, touched}) => (
            <div>
                <Form>
                <div>
                    <span>Słowo</span>
                    <Field name='text' type='text'/>
                    {(errors.text && touched.text) ? (<div>{errors.text}</div>):(null)}
                    </div>
                <button type="submit">Dodaj słowo</button>
                </Form>
            </div>
        )}
        </Formik>
        {respond}
        <WordList/>
        </div>
        )
}

export default WordAdd;
