import { useContext } from 'react';
import { UserPreferenceContext } from '../components/compounds/UserPreference';

const usePreference = () => {
    const data = useContext(UserPreferenceContext);

    return data;
};

export default usePreference;
