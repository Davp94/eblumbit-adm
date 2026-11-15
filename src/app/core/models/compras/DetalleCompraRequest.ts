export interface DetalleCompraRequest {
    productoId: number;
    almacenId: number;
    cantidad: number;
    precioUnitarioCompra: number;
    observaciones: string;
}