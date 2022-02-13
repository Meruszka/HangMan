import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './ducks/UI/Main/main';
import SignIn from './ducks/UI/User/userAdd';
import Game from './ducks/UI/Game/Game';
import { Connector } from 'mqtt-react-hooks';
import LogIn from './ducks/UI/User/logIn';
import './Css/main.css'
import AdminPanel from './ducks/UI/Admin/adminPanel';
import ip from './config.js'


function App() {

  return (
    <div className='main'>
      <Connector brokerUrl={`mqtt://${ip}:8000/mqtt`} options={{
        keepalive: 0
      }}>
        <Router>
          <Switch>
            <Route exact path={'/'} component={Main}/>
            <Route exact path={'/login'} component={LogIn}/> 
            <Route exact path={'/game'} component={SignIn}/>
            <Route exact path={'/game/:id'} component={Game}/>
            <Route exact path={'/admin'} component={AdminPanel}/>
          </Switch>
        </Router>
      </Connector>
    </div>
  );
}

export default App;
