export interface UsuariosResponse{
    id: number;
    username: string;
    email: string;
    nombres: string;
    apellidos: string;
    rolIds: number[];
    permissionsIds?: number[];
}