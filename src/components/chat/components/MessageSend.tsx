import { useAuth0 } from '@auth0/auth0-react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useRef } from 'react';
import { useSocket } from '../../../context/socket';
import styles from '../Chat.module.css';

const MessageSend: FunctionComponent = () => {
    const socket = useSocket();
    const data = useAuth0();
    const counterRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!counterRef.current) {
            return 0;
        }
        if (event.target.value.length > 0) {
            counterRef.current.style.display = 'block';
            counterRef.current.innerHTML = `${event.target.value.length}/255`;
        }
    };

    const handleSubmit = (event: SyntheticEvent) => {
        if (!data.user) return;
        event.preventDefault();
        const target = event.target as HTMLInputElement[] & typeof event.target;
        socket.emit('send-message', {
            profile: {
                picture: data.user.picture,
                username: data.user.nickname,
            },
            message: target[0].value,
            date: new Date(),
        });

        target[0].value = '';
        if (counterRef.current) {
            counterRef.current.style.display = 'none';
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className={`${styles['chat-form']} w-full flex justify-between items-center`}>
            <div className='flex flex-col'>
                <input
                    type='text'
                    name='message'
                    max='255'
                    className='py-3 px-2 border border-black rounded-md mr-2 w-full'
                    placeholder='Send a message'
                    onChange={handleChange}
                />
                <div
                    className='text-sm font-light self-end'
                    style={{ display: 'none' }}
                    ref={counterRef}>
                    0/255
                </div>
            </div>
            <button
                type='submit'
                className='ml-2 flex p-2 self-base items-center justify-center hover:text-white hover:bg-gray-400 rounded-full'>
                <FontAwesomeIcon
                    className='text-indigo-600'
                    icon={faPaperPlane}
                />
            </button>
        </form>
    );
};

export default MessageSend;
