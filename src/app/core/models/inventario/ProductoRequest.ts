export interface ProductoRequest {
    nombre: string;
    codigoBarra: string;
    unidadMedida: string;
    marca: string;
    imagen: File;
    descripcion: string;
    precioVentaActual: number;
    stockMinimo: number;
    estado: boolean;
    categoriaId: number;
}