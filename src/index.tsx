import { render } from 'react-dom';
import App from './App';
import io from 'socket.io-client';
import './style.css';
import 'dotenv';

const socket = io(`${process.env.REACT_APP_SERVER_HOST}`, {
    autoConnect: false,
});

const root = document.getElementById('root') as HTMLDivElement;

render(<App socket={socket} />, root);
