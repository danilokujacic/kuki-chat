import { FunctionComponent, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { isNotification, TChat, TNotification } from '../Chat';
import styles from '../Chat.module.css';
import SeenContainer from './SeenContainer';
import usePreference from '../../../hooks/usePreference';
import { Link } from '@reach/router';

const preferedChatBubbleColor = {
    blue: 'from-blue-700 to-purple-400',
    green: 'from-green-600 to-green-300',
    red: 'from-yellow-600 to-yellow-400',
};

const NotificationNode: FunctionComponent<{
    notification: TNotification;
}> = ({ notification }) => (
    <div className='w-full flex flex-col items-center justify-center text-gray-600 my-6 text-sm'>
        <p>
            {notification.rank} - {notification.username} {notification.type}{' '}
            the chat.
        </p>
        <p>{notification.comment}</p>
    </div>
);

const MessageNode: FunctionComponent<{
    item: TChat;
    index: number;
    user: any;
    isLastMessage: boolean;
}> = ({ item, index, isLastMessage, user }) => {
    const tipRef = useRef<HTMLAnchorElement | null>(null);
    const [preferences] = usePreference();

    if (isNotification(item))
        return <NotificationNode notification={item} key={index} />;
    return (
        <div
            className={`${styles['chat-node']} ${
                user.nickname === item.profile.username
                    ? `${styles['left-side']} mt-3`
                    : `${styles['opposite']} mt-3 mb-3`
            } `}>
            <Link
                ref={tipRef}
                data-tip={item.profile.username}
                data-for={'node-' + index}
                to={`profile/${
                    user.nickname === item.profile.username
                        ? ''
                        : item.profile.username
                }`}>
                <img src={item.profile.picture} alt='User avatar' />
            </Link>
            <div className={styles['chat-holder']}>
                <div
                    data-tip={item.chatDate}
                    data-for={'node-chat-' + index}
                    className={`${
                        user.nickname === item.profile.username
                            ? `bg-gradient-to-tr ${
                                  preferedChatBubbleColor[
                                      preferences.chatBubbleColor
                                  ]
                              } text-white`
                            : 'bg-gray-300 text-black'
                    }  box-border p-3`}>
                    {item.message}
                </div>
                {item.seen && item.seen.length && isLastMessage ? (
                    <SeenContainer seens={item.seen} chatNodeIndex={index} />
                ) : (
                    <></>
                )}
            </div>
            <ReactTooltip id={'node-' + index} />
            <ReactTooltip id={'node-chat-' + index} />
        </div>
    );
};

export default MessageNode;
