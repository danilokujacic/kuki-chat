import { useAuth0 } from '@auth0/auth0-react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    ChangeEvent,
    FunctionComponent,
    SyntheticEvent,
    useRef,
    useState,
} from 'react';
import { useSocket } from '../../../context/socket';
import styles from '../Chat.module.css';
import { format } from 'date-fns';
import usePreference from '../../../hooks/usePreference';
import { applyPreferences } from '../../../client/preferences';

const MessageToolbar: FunctionComponent<{ username?: string }> = ({
    username,
}) => {
    const [preferences, setPreferences] = usePreference();
    const handlePreference = async (color: 'red' | 'green' | 'blue') => {
        if (preferences.chatBubbleColor === color || !username) return;
        const newPreferences = { ...preferences, chatBubbleColor: color };
        await applyPreferences(newPreferences, username);
        setPreferences(newPreferences);
    };
    const prefs: { class: string; color: 'red' | 'green' | 'blue' }[] = [
        {
            color: 'red',
            class: 'from-yellow-600 to-yellow-100',
        },
        {
            color: 'blue',
            class: 'from-blue-700 to-purple-300',
        },
        {
            color: 'green',
            class: 'from-green-500 to-lime-500',
        },
    ];

    return (
        <div className='flex space-x-2 items-center h-full justify-self-end pr-2'>
            {prefs.map((item) => (
                <button
                    key={item.color}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handlePreference(item.color);
                    }}
                    className={`bg-gradient-to-tr ${styles['preference-bubble']} ${item.class}`}></button>
            ))}
        </div>
    );
};

const MessageSend: FunctionComponent = () => {
    const socket = useSocket();
    const data = useAuth0();
    const counterRef = useRef<HTMLDivElement | null>(null);
    const fieldSetRef = useRef<HTMLFieldSetElement | null>(null);
    const [displayToolbar, setDisplayToolbar] = useState<boolean>(true);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 255) {
            event.target.value = event.target.value.slice(0, 255);
        }
        if (!event.target.value) {
            setDisplayToolbar(true);
        } else if (displayToolbar) {
            setDisplayToolbar(false);
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
    const handleFocus = () => {
        if (fieldSetRef.current) {
            fieldSetRef.current.classList.remove('border-black');
            fieldSetRef.current.classList.remove('border');
            fieldSetRef.current.classList.add('border-2');
            fieldSetRef.current.classList.add('border-blue-500');
        }
    };
    const handleBlur = () => {
        if (fieldSetRef.current) {
            fieldSetRef.current.classList.remove('border-2');
            fieldSetRef.current.classList.remove('border-blue-500');
            fieldSetRef.current.classList.add('border');
            fieldSetRef.current.classList.add('border-black');
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
            <fieldset
                ref={fieldSetRef}
                className='w-full relative transition-colors duration-100 flex justify-between items-center border border-black rounded-lg'>
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
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                {displayToolbar ? (
                    <MessageToolbar username={data.user?.nickname} />
                ) : (
                    <button
                        type='submit'
                        className='shadow-lg shadow-blue-500 mr-2 flex p-2 self-base items-center justify-center hover:text-white hover:bg-gray-400 rounded-full'>
                        <FontAwesomeIcon
                            className='text-indigo-600'
                            icon={faPaperPlane}
                        />
                    </button>
                )}
            </fieldset>
        </form>
    );
};

export default MessageSend;
