import { IPreferences } from '../components/compounds/UserPreference';

export const getPreferences = async (username: string) => {
    try {
        const preferences = await fetch(
            `${process.env.REACT_APP_SERVER_HOST}/preferences/${username}`,
        ).then((res: Response) => res.json());

        if (preferences.length) {
            return preferences[0].preferences as IPreferences;
        }
    } catch (err) {
        if (err instanceof Error) {
            throw Error(err.message);
        }
    }
};

export const applyPreferences = async (
    preferences: IPreferences,
    username: string,
) => {
    try {
        await fetch(
            `${process.env.REACT_APP_SERVER_HOST}/preferences/${username}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ preferences }),
            },
        ).then((res: Response) => res.json());
    } catch (err) {
        if (err instanceof Error) {
            throw Error(err.message);
        }
    }
};
