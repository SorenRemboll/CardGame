export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    GAME: '/game',
    CHARACTER:' /character',
    CHARACTER_OVERVIEW: '/character/overview',
    CHARACTER_DECKS: '/character/decks',
} as const
export const PROTECTED_ROUTES = [
    ROUTES.GAME,
    ROUTES.CHARACTER,
    ROUTES.CHARACTER_OVERVIEW,
    ROUTES.CHARACTER_DECKS,
] as const;