import { TChat } from '../components/chat/Chat';

export const getChat = async (id: number) => {
    try {
        const chat = await (
            await fetch(`${process.env.REACT_APP_SERVER_HOST}/chat/${id}`)
        ).json();
        return chat;
    } catch (err) {
        if (err instanceof Error) {
            throw Error(err.message);
        }
    }
};
export const sendChat = async (
    chats: TChat[],
    id: number,
    username: string,
) => {
    try {
        await fetch(`${process.env.REACT_APP_SERVER_HOST}/chat/${id}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                chats,
                users: [username],
            }),
        });
    } catch (err) {
        if (err instanceof Error) {
            throw Error(err.message);
        }
    }
};
