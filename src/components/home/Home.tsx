import { useAuth0 } from '@auth0/auth0-react';
import { RouteComponentProps } from '@reach/router';
import { FunctionComponent } from 'react';
import Chat from '../chat/Chat';
import styles from './Home.module.css';
import arrow from '../../assets/arrow.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import UserPreference from '../compounds/UserPreference';

const Home: FunctionComponent<RouteComponentProps> = () => {
    const { user } = useAuth0();
    if (!user) {
        return (
            <div
                className={`${styles['register-info']} flex w-full justify-center items-center p-6 z-20`}>
                <img src={arrow} alt='arrow' />
                <h1 className='text-2xl font-semibold text-gray-600 text-center'>
                    <FontAwesomeIcon
                        className='text-indigo-600 mr-2 mb-3'
                        size='2x'
                        icon={faExclamationCircle}
                    />
                    <br />
                    Register or login to access chat
                </h1>
            </div>
        );
    }
    return (
        <div>
            <UserPreference>
                <Chat />
            </UserPreference>
        </div>
    );
};

export default Home;
