import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { TChat } from '../Chat';
import styles from '../Chat.module.css';

const MessageNode: FunctionComponent<{ item: TChat; index: number }> = ({
    item,
    index,
}) => {
    const data = useAuth0();
    const tipRef = useRef<HTMLDivElement | null>(null);

    if (!data.user) {
        throw Error('Not connected');
    }

    return (
        <div
            className={`${styles['chat-node']} ${
                data.user.nickname === item.profile.username
                    ? 'mt-3'
                    : `${styles['opposite']} mt-3 mb-3`
            } `}>
            <div
                ref={tipRef}
                data-tip={item.profile.username}
                data-for={'node-' + index}>
                <img src={item.profile.picture} alt='User avatar' />
            </div>
            <div
                data-tip={item.chatDate}
                data-for={'node-chat-' + index}
                className={`${
                    data.user.nickname === item.profile.username
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-300 text-black'
                }  box-border p-3`}>
                {item.message}
            </div>
            <ReactTooltip id={'node-' + index} />
            <ReactTooltip id={'node-chat-' + index} />
        </div>
    );
};

export default MessageNode;
