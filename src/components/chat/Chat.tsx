import { FunctionComponent, useState } from 'react';
import MessageSend from './components/MessageSend';
import styles from './Chat.module.css';
import MessageNode from './components/MessageNode';
import useChat from '../../hooks/useChat';

export type TUser = { picture: string; username: string };

type TCasualChat = {
    profile: TUser;
    message: string;
    date: Date;
    chatDate: string;
    seen: TUser[];
};
export type TNotification = {
    rank: string;
    username: string;
    comment: string;
    type: 'joined' | 'left';
};

export type TChat = TCasualChat | TNotification;

export const isNotification = (x: TChat): x is TNotification =>
    Boolean((x as TNotification).rank);

const Chat: FunctionComponent = () => {
    const [chatRef, setChatRef] = useState<HTMLDivElement | null>(null);
    const { chat, user } = useChat({ containerRef: chatRef });

    let chatTemplate;

    if (!user) {
        return <></>;
    }
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
                ref={setChatRef}
                style={{
                    height:
                        screen.width < 768
                            ? window.innerHeight - 119
                            : undefined,
                }}
                className={`${styles['chat-log']} flex flex-col h-11/12 overflow-y-scroll`}>
                {chat.map((item, index) => (
                    <MessageNode
                        user={user}
                        key={index}
                        index={index}
                        item={item}
                        isLastMessage={chat.length - 1 === index}
                    />
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
