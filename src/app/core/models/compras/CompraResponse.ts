import { DetalleCompraResponse } from "./DetalleCompraResponse";

export interface CompraResponse {
    id: number;
    codigo: string;
    fecha: string;
    proveedorId: number;
    proveedorRazonSocial: string;
    proveedorNroIdentificacion: string;
    usuarioId: number;
    username: string;
    descuentoTotal?: number;
    estado: string;
    detalle: string;
    observaciones: string;
    detalleCompra?: DetalleCompraResponse[] | null;
}