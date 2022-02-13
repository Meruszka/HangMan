import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useMqttState } from 'mqtt-react-hooks';
import axios from 'axios';
import Cookies from 'js-cookie';
import ip from '../../../config.js';


function Main() {
const { connectionStatus } = useMqttState();
const [games, setGames] = useState([]);
const [cookies, setCookies] = useState(Cookies.get('username'));
useEffect(() => {
    axios.get(`http://${ip}:5000/games/allGames`).then(res => setGames(res.data))
}, [])
  return (
    <div className="App">

        <Link to={'/game'}>
            <button>
                New game!
            </button>
        </Link>
        {cookies? (
            <button onClick={() => {
                setCookies(undefined)
                Cookies.remove('username')
            }}>
                Wyloguj!
            </button>
        ):
        (
        <Link to={'/login'}>
            <button>
                Zaloguj!
            </button>
        </Link>  
        )}
        <div>
            {games.map((ele, index) => (
                <div key={index} className='games'>
                    <div>
                    {ele.guesses}
                    </div>
                    {Cookies.get('username') ? 
                    (<button>
                        <Link to={{ pathname:`/game/${ele.gameid}`,
                                state: ele
                                }}> Dołącz</Link>
                    </button>) : null}
                </div>
            ))}
        </div>
        <div>
            Tutaj będzie najlepszy zawodnik! PO MQTT
        </div>
        {connectionStatus}
    </div>
  );
}

export default Main;
