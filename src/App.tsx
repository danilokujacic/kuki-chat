import { FunctionComponent } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import Header from './components/header/Header';
import { Router } from '@reach/router';
import Profile from './components/profile/Profile';
import Home from './components/home/Home';
import { SocketContext } from './context/socket';

const oidcConfig = {
    scope: 'openid profile email',
    domain: `${process.env.REACT_APP_ISSUER_BASE_URL}`,
    clientId: `${process.env.REACT_APP_CLIENT_ID}`,
    redirectUri: window.location.origin,
};

const App: FunctionComponent<{ socket: any }> = ({ socket }) => {
    return (
        <Auth0Provider {...oidcConfig}>
            <SocketContext.Provider value={socket}>
                <Header />
                <Router>
                    <Home path='/' />
                    <Profile path='/profile' />
                    <Profile path='/profile/:id' />
                </Router>
            </SocketContext.Provider>
        </Auth0Provider>
    );
};

export default App;
