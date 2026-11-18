export interface DetalleCompraResponse {
    id: number;
    compraId: number;
    productoId: number;
    productoNombre: string;
    almacenId: number;
    almacenNombre: string;
    cantidad: number;
    precioUnitarioCompra: number;
    observaciones: string;
}