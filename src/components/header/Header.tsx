import { useAuth0 } from '@auth0/auth0-react';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import { FunctionComponent } from 'react';
import HeaderProfile from './components/HeaderProfile';
import styles from './Header.module.css';

const Header: FunctionComponent = () => {
    const data = useAuth0();
    return (
        <div className='px-6 py-3 bg-indigo-800 text-white flex justify-between items-center relative z-10'>
            <div>
                <Link
                    to='/'
                    className={`${styles['home-container']} rounded-full hover:bg-indigo-300`}>
                    <FontAwesomeIcon icon={faHome} />
                </Link>
            </div>
            <div>
                {data.user ? (
                    <HeaderProfile user={data.user} logout={data.logout} />
                ) : (
                    <button onClick={data.loginWithPopup}>Login</button>
                )}
            </div>
        </div>
    );
};

export default Header;
