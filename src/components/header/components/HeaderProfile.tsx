import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import { User, LogoutOptions } from '@auth0/auth0-react';
import { FunctionComponent, useState } from 'react';
import styles from '../Header.module.css';

const HeaderProfile: FunctionComponent<{
    user: User;
    logout: (options?: LogoutOptions) => void;
}> = ({ user, logout }) => {
    const [buttonToggled, setButtonToggled] = useState<boolean>(false);

    const toggleButton = (func?: any) => {
        if (func) {
            func();
        }
        setButtonToggled(!buttonToggled);
    };

    const { picture, nickname } = user;
    return (
        <div className='flex  items-center relative'>
            <div className={`${styles['avatar']} rounded-full overflow-hidden`}>
                <img src={picture} alt='User avatar' />
            </div>
            <span className='ml-3'>{nickname}</span>
            <button
                onClick={() => toggleButton()}
                className={`${styles['chevron-button']} ml-2`}>
                <FontAwesomeIcon
                    icon={!buttonToggled ? faChevronDown : faChevronUp}
                />
            </button>
            {buttonToggled && (
                <div
                    className={`${styles['profile-modal']} space-y-2 p-2 box-border bg-white flex flex-col text-black rounded border border-black`}>
                    <button
                        className={`${styles['chevron-button']}`}
                        onClick={() => toggleButton(logout)}>
                        Sign out
                    </button>
                    <Link onClick={() => toggleButton()} to='profile'>
                        View profile
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HeaderProfile;
