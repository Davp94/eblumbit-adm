import { DetalleCompraRequest } from "./DetalleCompraRequest";

export interface ComprasRequest {
    proveedorId: number;
    usuarioId: number;
    detalle: string;
    descuentoTotal?: number;
    observaciones: string;
    detalleCompra: DetalleCompraRequest[];
}