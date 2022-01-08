export const getUser = async (id: string) => {
    try {
        const user = await fetch(
            `${process.env.REACT_APP_ISSUER_BASE_URL}/api/v2/users?q=nickname:"${id}"`,
            {
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
                },
            },
        );
        return await user.json();
    } catch (err) {
        if (err instanceof Error) throw Error(err.message);
    }
};
