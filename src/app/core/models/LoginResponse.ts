export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    identifier: number;
    expiration: number;
}