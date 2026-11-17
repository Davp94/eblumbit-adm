export interface CompraResponse {
    id: number;
    proveedorId: number;
    usuarioId: number;
    detalle: string;
    descuentoTotal?: number;
    observaciones: string;
}