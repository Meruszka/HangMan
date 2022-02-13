import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ip from '../../../../config.js'


function WordList() {
    const [ words, setWords ] = useState([])
    const [ wordFilter, setWordFilter ] = useState('')
    const [ idFilter, setIDFilter ] = useState('')
    async function getWords(){
        await axios.get(`http://${ip}:5000/word`).then(res => setWords(res.data))
    }

    useEffect(() => {
        getWords()
    }, [])
    const handleDelete = async (id) => {
        await axios.delete(`http://${ip}:5000/word/${id}`)
            .then(() => console.log(`Usunięty wyraz ${id}`))
            .catch((err) => console.log(err))
    }
    return(
        <div>
            Szukaj słowa po ID lub/i po podsłowie
        <form>
        <label>ID</label>
        <input type="text" value={idFilter} onChange={(e) => setIDFilter(e.target.value)}/>
        <label>Słowo</label>
        <input type="text" value={wordFilter} onChange={(e) => setWordFilter(e.target.value)}/>
        </form>
        {wordFilter || idFilter ?(
            <ul>
                {words.filter(ele => ele.id.toString().includes(idFilter)).filter(ele => ele.text.includes(wordFilter)).map(ele => (
                    <li key={ele.id}>
                        {ele.id} || {ele.text}
                        <button onClick={() => handleDelete(ele.id)}>
                            Usuń!
                        </button>
                    </li>
                ))}
            </ul>
        ): null}
        </div>
        )
}

export default WordList;
