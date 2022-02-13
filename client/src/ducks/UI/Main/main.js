import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useMqttState } from 'mqtt-react-hooks';
import axios from 'axios';
import Cookies from 'js-cookie';
import ip from '../../../config.js';
import img from '../Game/Wisielec/import'



function Main() {
const { connectionStatus } = useMqttState();
const [games, setGames] = useState([]);
const [cookies, setCookies] = useState(Cookies.get('username'));
useEffect(() => {
    axios.get(`http://${ip}:5000/games/allGames`).then(res => setGames(res.data))
}, [])
  return (
    <div className="App">
        <nav>
            <Link to={'/game'}>
                <button>
                    New game!
                </button>
            </Link>
            {cookies? (
                <Link to={'/'}>
                                <button onClick={() => {
                    setCookies(undefined)
                    Cookies.remove('username')
                }}>
                    Wyloguj!
                </button>
                </Link>
            ):
            (
            <Link to={'/login'}>
                <button>
                    Zaloguj!
                </button>
            </Link>  
            )}
        </nav>
        <div>
            {games.map((ele, index) => (
                <div key={index} className='games'>
                    <div>
                        <img alt ='HTML5' src={`${img["hang"+(ele.num +1)]}`} style={{width: 200, height: 200}}/>
                    </div>
                    <div>
                    {ele.guesses}
                    </div>
                    {ele.help?(<div>Pomocy!!</div>):null}
                    {Cookies.get('username') ? 
                    (<button>
                        <Link to={{ pathname:`/game/${ele.gameid}`,
                                state: ele
                                }}> Dołącz</Link>
                    </button>) : null}
                </div>
            ))}
        </div>
        {/* <div>
            Tutaj będzie najlepszy zawodnik! PO MQTT
        </div> */}
        {connectionStatus}
    </div>
  );
}

export default Main;
