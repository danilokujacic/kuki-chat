import { RouteComponentProps, useParams } from '@reach/router';
import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import styles from './Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useEffect } from 'react';
import { getUser } from '../../client/users';
import { format } from 'date-fns';

const getIcon = (value: boolean) => (
    <FontAwesomeIcon
        className={value ? 'text-green-500' : 'text-red-500'}
        icon={value ? faCheckCircle : faTimesCircle}
    />
);

const formatKey = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');

const formatValue = (key: string, value: unknown) => {
    if (typeof value === 'string') {
        if (key === 'last_login') {
            return format(new Date(value), 'dd/MM/yyyy HH:mm:ss');
        }

        return value;
    }
    return getIcon(value as boolean);
};
const mapUserProperties = ([key, value]: [string, unknown]) => {
    if (
        key.includes('name') ||
        key.includes('email') ||
        key.includes('last_login')
    ) {
        if (key.includes('given') || key.includes('family')) {
            return;
        }
        return (
            <div className='flex flex-col md:flex-row md:space-x-3'>
                <span className='text-indigo-700'>{formatKey(key)}</span>
                <span className='text-gray-700'>{formatValue(key, value)}</span>
            </div>
        );
    }
};

const Profile: FunctionComponent<RouteComponentProps> = () => {
    const { user } = useAuth0();
    const { id } = useParams();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        (async () => {
            if (id) {
                const userProfile = await getUser(id);
                setProfile(userProfile[0]);
            } else if (user) {
                setProfile(user);
            }
        })();
    }, [id, user]);
    if (!profile) {
        return <div>Loading...</div>;
    }
    return (
        <div className='flex flex-col w-full space-y-2 px-6 py-3 text-xl'>
            <div className='flex justify-center mb-3'>
                <div
                    className={`${styles['avatar']} rounded-full overflow-hidden`}>
                    <img src={profile.picture} alt='User avatar' />
                </div>
            </div>
            {Object.entries(profile).map(mapUserProperties)}
        </div>
    );
};

export default Profile;
