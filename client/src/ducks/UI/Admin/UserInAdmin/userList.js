import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ip from '../../../../config.js'


function UserList() {
    const [ users, setUsers ] = useState([])
    async function getUsers(){
        await axios.get(`http://${ip}:5000/person`).then(res => setUsers(res.data.filter(ele => ele.nick !== 'admin')))
    }
    useEffect(() => {
        getUsers()
    }, [])
    const handleDelete = async (id) => {
        await axios.delete(`http://${ip}:5000/person/${id}`)
            .then(() => console.log(`Usunięty użytkowinik ${id}`))
            .catch((err) => console.log(err))
    }
    return(
        <div>
            ID || NICK || HAŁSO
        <ul>
            {users.map(ele => (
                <li key={ele.id}>
                    <div>
                        {ele.id} || {ele.nick} || {ele.password}
                    </div>
                    <button onClick={() => handleDelete(ele.id)}>
                        Usuń!    
                    </button>
                </li>
            ))}
        </ul>
        </div>
        )
}

export default UserList;
