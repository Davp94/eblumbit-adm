export interface Session {
    accessToken: string;
    refreshToken: string;
    identifier: number;
    expiration: number;
}