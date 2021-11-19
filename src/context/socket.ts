import { createContext, useContext } from 'react';

export const SocketContext = createContext<any>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw Error(
            "Socket not found! You probably didn't place hook inside " +
                SocketContext.displayName,
        );
    }

    return socket;
};
