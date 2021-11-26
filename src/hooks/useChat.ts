import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { TChat, TUser } from '../components/chat/Chat';
import { useSocket } from '../context/socket';
import { getChat } from '../client/chat';

interface IuseChat {
    containerRef: HTMLDivElement | null;
}

const isUserAtBottom: (element: HTMLDivElement) => boolean = (element) => {
    if (screen.width < 768) {
        return (
            element.scrollTop + element.clientHeight >= element.scrollHeight - 5
        );
    }
    return element.scrollTop + element.clientHeight === element.scrollHeight;
};

const useChat = ({ containerRef }: IuseChat) => {
    const data = useAuth0();
    const socket = useSocket();
    const [chat, setChat] = useState<TChat[] | null | 'NOT_CONNECTED'>(null);

    const triggerSeen = () => {
        if (!chat || !chat.length || typeof chat === 'string') return;
        const { picture, nickname } = data.user!;
        const lastChat = chat[chat.length - 1];
        if (lastChat.profile.username !== nickname) {
            const indexUser = lastChat.seen.findIndex(
                (el: TUser) => el.username === nickname,
            );
            if (indexUser === -1) {
                socket.emit('seen-message', {
                    picture,
                    username: nickname,
                    date: new Date(),
                    chats: chat,
                });
            }
        }
    };
    useEffect(() => {
        if (data.user) {
            socket.auth = { username: data.user.nickname };
            socket.connect();

            //Listen to socket
            socket.on('receive_seen', (data: TChat[]) => {
                setChat([...data]);
            });

            socket.on('receive_message', (chats: TChat[]) => {
                setChat([...(Array.isArray(chat) ? chat : []), ...chats]);
            });
        }
    }, [data]);

    useEffect(() => {
        if (!chat || !chat.length) {
            getChat(0).then((res: TChat[]) => setChat(res));
        }
        if (typeof chat === 'string') {
            return;
        }
        const pageEventListener = () => {
            if (
                containerRef &&
                containerRef.clientHeight === containerRef.scrollHeight
            ) {
                triggerSeen();
            }
        };
        window.onclick = pageEventListener;
        window.ontouchstart = pageEventListener;
        window.onmousemove = pageEventListener;
        window.onmousedown = pageEventListener;
        window.onfocus = pageEventListener;

        const scrollListener = (event: Event) => {
            const element = event.target as HTMLDivElement;
            if (isUserAtBottom(element)) {
                triggerSeen();
            }
        };
        if (containerRef) {
            if (Math.floor(containerRef.scrollHeight) === 0) {
                alert('trigerio');
                triggerSeen();
            }
            containerRef.scrollTop = containerRef.scrollHeight;
            containerRef.addEventListener('scroll', scrollListener);
        }

        return () => {
            if (containerRef) {
                containerRef.removeEventListener('scroll', scrollListener);
            }
        };
    }, [containerRef, chat, triggerSeen]);

    return { chat: chat as TChat[] | null | 'NOT_CONNECTED', user: data.user };
};

export default useChat;
