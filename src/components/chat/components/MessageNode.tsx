import { FunctionComponent, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { TChat } from '../Chat';
import styles from '../Chat.module.css';
import SeenContainer from './SeenContainer';

const MessageNode: FunctionComponent<{
    item: TChat;
    index: number;
    user: any;
    isLastMessage: boolean;
}> = ({ item, index, isLastMessage, user }) => {
    const tipRef = useRef<HTMLDivElement | null>(null);
    console.log(item.chatDate);
    return (
        <div
            className={`${styles['chat-node']} ${
                user.nickname === item.profile.username
                    ? `${styles['left-side']} mt-3`
                    : `${styles['opposite']} mt-3 mb-3`
            } `}>
            <div
                ref={tipRef}
                data-tip={item.profile.username}
                data-for={'node-' + index}>
                <img src={item.profile.picture} alt='User avatar' />
            </div>
            <div>
                <div
                    data-tip={item.chatDate}
                    data-for={'node-chat-' + index}
                    className={`${
                        user.nickname === item.profile.username
                            ? 'bg-indigo-600 text-white'
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
