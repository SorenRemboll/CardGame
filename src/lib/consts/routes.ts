export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    GAME: '/game',
    CHARACTER:' /character',
    CHARACTER_OVERVIEW: '/character/overview',
    CHARACTER_DECKS: '/character/decks',
    CHARACTER_BATTLES: '/battles',
    LOADING: '/loading',
    CHARACTER_DECK:(deck_id: number | 'new-deck'): `/character/decks/${number | 'new-deck'}` => `/character/decks/${deck_id}`,
} as const
export const PROTECTED_ROUTES = [
    ROUTES.GAME,
    ROUTES.CHARACTER,
    ROUTES.CHARACTER_OVERVIEW,
    ROUTES.CHARACTER_DECKS,
    ROUTES.CHARACTER_BATTLES,
    ROUTES.LOADING, 
] as const;
export const BATTLE_ROUTES = [
    ROUTES.LOADING,
    ROUTES.GAME,
    
]