import { createContext, useCallback, useContext } from 'react';

export const UserMetaContext = createContext<[IUserMeta, Function] | null>(
    null,
);

export interface IUserMeta {
    atPage: boolean;
}

const useUserMeta = () => {
    const userData = useContext<[IUserMeta, Function] | null>(UserMetaContext);

    if (!userData) {
        throw Error(
            "User metadata not found! You probably didn't put hook into context",
        );
    }
    const [usrData, setUserData] = userData;
    const handleUserMeta = useCallback((state: IUserMeta) => {
        setUserData(state);
    }, []);

    return { userData: usrData, handleUserMeta };
};

export default useUserMeta;
