/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useMqttState, useSubscription } from 'mqtt-react-hooks'
import img from './Wisielec/import'
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


function Game(props) {
  const [ word, setWord ] = useState(props.location.state.guesses || {});
  const [ result, setResult ] = useState([]);
  const [ letters, setLetters ] = useState(props.location.state.letters.split(''));
  const [ num, setNum ] = useState(props.location.state.num + 1)
  const [ chat, setChat ] = useState([])
  const { client } = useMqttState();
  const gameid = props.match.params.id;
  const  { message } = useSubscription([`game/${gameid}/r`,`game/${gameid}/rw`, `game/${gameid}/letters`, `chat/${gameid}/R`])
  const validInputChat = Yup.object().shape({
      message: Yup.string()
                .max(100, "Za długie")
  })
  useEffect(() => {
    const rw = new RegExp(".+/rw$")
    const r = new RegExp(".+/r$")
    const chatRespons = new RegExp(".+/R$")
    const lettersTest = new RegExp(".+/letters")
    if (message) {
        if(rw.test(message.topic)){
            setResult(message)
        }
        if(lettersTest.test(message.topic)){
            setLetters(message.message.split(''))
        }
        if(r.test(message.topic)){
            if(message.message === 'bad'){
                if(num <= 10){
                    setNum(num+1)
                }
            }else{
                setWord(message.message)
            }
        }
        if(chatRespons.test(message.topic)){
            setChat([message.message, ...chat])
        }
    }
  }, [message]);
  const handleSumbitLetter = async (values) => {
    if(num <= 10){
        client.publish(`game/${gameid}`, values.toLowerCase())
        client.publish(`chat/${gameid}`, Cookies.get('username')+' Strzela: '+ values.toUpperCase()) 
    }
  }
  const handleSumbitChat = async (values) => {
    console.log(values)
    client.publish(`chat/${gameid}`, Cookies.get('username')+': '+values.message)
  }
  const helpMe = () => {
      // Na kanał od pomocy 
      client.publish(`help/${gameid}`, 'help')
  }
    return(
        <div className="game">
            <div className="withIMG">
                {result.message !== "win"? (
                    <img alt ='HTML5' src={`${img["hang"+num]}`} style={{width: 200, height: 200}}/>
                ):
                (
                    <img alt ='HTML5' src={`${img['win']}`} style={{width: 200, height: 200}}/>
                )}
                
            </div>
            <div className="letters">
                {word}
            </div>
            <div className="panel">
                {'aąbcćdeęfghijklłmnoóprstuwyzżź'.split('').filter(ele => !letters.includes(ele)).map((ele, index) => (
                    <div key={index}>
                        <button onClick={() => handleSumbitLetter(ele)}>{ele.toUpperCase()}</button>
                    </div>
                ))}
            </div>
            Chat
            <div className="chat">
                {chat.map((ele, index) => (
                    <div key={index} className="message">
                        {ele}
                    </div>
                ))}
            </div>
            <Formik
            onSubmit={(values) => handleSumbitChat(values)}
            validationSchema={validInputChat}
            initialValues={{
                message: '',
            }}>
            {({errors, touched}) => (
                <div>
                    <Form>
                    <div>
                        <Field name='message' type='text' autoComplete="off"/>
                        {(errors.message && touched.message) ? (<div className="error" >{errors.message}</div>):null}
                    </div>
                    <button type="submit">Wyślij</button>
                    </Form>
                </div>
            )}
            </Formik>
            <div className="cofnij">
                <Link to={'/'}>
                    <button onClick={() => helpMe()}>
                        Pomocy
                    </button>
                </Link>
                <Link to={'/'}>
                    <button>
                        Cofnij
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Game;
