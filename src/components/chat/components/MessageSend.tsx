import { useAuth0 } from '@auth0/auth0-react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FunctionComponent, SyntheticEvent, useRef } from 'react';
import { useSocket } from '../../../context/socket';
import styles from '../Chat.module.css';
import { format } from 'date-fns';

const MessageSend: FunctionComponent = () => {
    const socket = useSocket();
    const data = useAuth0();
    const counterRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 255) {
            event.target.value = event.target.value.slice(0, 255);
        }
        if (!counterRef.current) {
            return 0;
        }
        if (!event.target.value.length) {
            return (counterRef.current.style.display = 'none');
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
            message: target[1].value,
            date: format(new Date(), 'HH:mm'),
        });

        target[1].value = '';
        if (counterRef.current) {
            counterRef.current.style.display = 'none';
        }
    };
    return (
        <form
            autoComplete='off'
            style={{
                height: screen.width < 768 ? 50 : undefined,
            }}
            onSubmit={handleSubmit}
            className={`${styles['chat-form']} `}>
            <fieldset className='w-full relative flex justify-between items-center border border-black rounded-lg'>
                <legend className='absolute ml-2 text-sm font-light'>
                    <div style={{ display: 'none' }} ref={counterRef}>
                        0/255
                    </div>
                </legend>
                <input
                    type='text'
                    required
                    name='message'
                    max='255'
                    className='flex-1 py-3 px-2 focus:outline-none rounded-lg'
                    placeholder='Send a message'
                    onChange={handleChange}
                />

                <button
                    type='submit'
                    className='mr-2 flex p-2 self-base items-center justify-center hover:text-white hover:bg-gray-400 rounded-full'>
                    <FontAwesomeIcon
                        className='text-indigo-600'
                        icon={faPaperPlane}
                    />
                </button>
            </fieldset>
        </form>
    );
};

export default MessageSend;
