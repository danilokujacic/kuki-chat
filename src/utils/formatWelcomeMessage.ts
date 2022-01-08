type TRanks = 'Beginner' | 'Intermediate' | 'Advanced' | 'Maniac';

const ranks: TRanks[] = ['Beginner', 'Intermediate', 'Advanced', 'Maniac'];
const randomMessages: string[] = [
    "Hope you'll die soon 💀",
    'Cheers! 🍻',
    'Wish you the best 💯',
    'Hello there you sexy bastard 😈😈',
    'I feel sorry for you 😥',
    'Please leave the chat as soon as you can 💢💢',
];

export const formatWelcomeMessage = (username: string) => ({
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    username,
    comment: randomMessages[Math.floor(Math.random() * ranks.length)],
});
