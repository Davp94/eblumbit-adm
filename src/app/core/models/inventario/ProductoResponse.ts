export interface ProductoResponse {
    id: number;
    nombre: string;
    codigoBarra: string;
    unidadMedida: string;
    marca: string;
    imagen: string;
    descripcion: string;
    precioVentaActual: number;
    stockMinimo: number;
    estado: boolean;
    fechaRegistro: string;
    categoriaId: number;
    categoriaNombre: string;
}