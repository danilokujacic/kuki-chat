import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/socket';
import MessageSend from './components/MessageSend';
import styles from './Chat.module.css';
import MessageNode from './components/MessageNode';
import { useAuth0 } from '@auth0/auth0-react';

export type TChat = {
    profile: {
        picture: string;
        username: string;
    };
    message: string;
    date: Date;
    chatDate: string;
};

const Chat: FunctionComponent = () => {
    const socket = useSocket();
    const authData = useAuth0();
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [chat, setChat] = useState<TChat[] | null | 'NOT_CONNECTED'>(null);
    let chatTemplate;

    useEffect(() => {
        if (authData.user) {
            socket.auth = { username: authData.user.nickname };
            socket.connect();
            socket.on('receive_message', (data: TChat[]) => {
                setChat([...(Array.isArray(chat) ? chat : []), ...data]);
                if (authData.user) {
                    fetch('http://localhost:9000/chat/0', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            chats: data,
                            users: [authData.user.nickname || ''],
                        }),
                    });
                }
            });
        }
    }, [authData]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
        if (!chat || !chat.length) {
            fetch('http://localhost:9000/chat/0')
                .then((res: any) => res.json())
                .then((data: any) => setChat(data));
        }
    }, [chat]);

    if (!chat) {
        chatTemplate = (
            <div className={`${styles['chat-log']} text-gray-600 text-2xl`}>
                Start a chat
                <br /> Send a message first
            </div>
        );
    } else if (chat === 'NOT_CONNECTED') {
        return <div>Lost connection to a chat. Reconnecting..</div>;
    } else {
        chatTemplate = (
            <div
                ref={chatRef}
                className={`${styles['chat-log']} flex flex-col h-11/12 overflow-y-scroll`}>
                {chat.map((item, index) => (
                    <MessageNode key={index} index={index} item={item} />
                ))}
            </div>
        );
    }
    return (
        <div
            className={`flex flex-col w-full ${styles['chat-container']} px-3 pb-3`}>
            {chatTemplate}
            <MessageSend />
        </div>
    );
};

export default Chat;
