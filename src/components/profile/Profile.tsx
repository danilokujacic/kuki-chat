import { RouteComponentProps } from '@reach/router';
import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import styles from './Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const getIcon = (value: boolean) => (
    <FontAwesomeIcon
        className={value ? 'text-green-500' : 'text-red-500'}
        icon={value ? faCheckCircle : faTimesCircle}
    />
);

const formatKey = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');

const mapUserProperties = ([key, value]: [string, string | boolean]) => {
    if (key.includes('name') || key.includes('email')) {
        if (key.includes('given') || key.includes('family')) {
            return;
        }
        return (
            <div className='flex flex-col md:flex-row md:space-x-3'>
                <span className='text-indigo-700'>{formatKey(key)}</span>
                <span className='text-gray-700'>
                    {typeof value === 'string' ? value : getIcon(value)}
                </span>
            </div>
        );
    }
};

const Profile: FunctionComponent<RouteComponentProps> = () => {
    const { user } = useAuth0();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col w-full space-y-2 px-6 py-3 text-xl'>
            <div className='flex justify-center mb-3'>
                <div
                    className={`${styles['avatar']} rounded-full overflow-hidden`}>
                    <img src={user.picture} alt='User avatar' />
                </div>
            </div>
            {Object.entries(user).map(mapUserProperties)}
        </div>
    );
};

export default Profile;
