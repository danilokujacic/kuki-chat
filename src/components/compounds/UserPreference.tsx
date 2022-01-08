import { useAuth0 } from '@auth0/auth0-react';
import {
    createContext,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { getPreferences } from '../../client/preferences';

export interface IPreferences {
    chatBubbleColor: 'green' | 'blue' | 'red';
}

export const UserPreferenceContext = createContext<
    [IPreferences, Dispatch<SetStateAction<IPreferences>>]
>([
    {
        chatBubbleColor: 'blue',
    },
    () => {},
]);

const UserPreference: FunctionComponent<{ children: JSX.Element }> = ({
    children,
}) => {
    const [preferences, setPreferences] = useState<IPreferences>({
        chatBubbleColor: 'blue',
    });

    const auth = useAuth0();

    useEffect(() => {
        (async () => {
            if (auth.user) {
                const preferencesAPI = await getPreferences(
                    auth.user.nickname as string,
                );
                if (!preferencesAPI) {
                    return;
                }
                setPreferences(preferencesAPI);
            }
        })();
    }, [auth]);
    return (
        <UserPreferenceContext.Provider value={[preferences, setPreferences]}>
            {children}
        </UserPreferenceContext.Provider>
    );
};

export default UserPreference;
