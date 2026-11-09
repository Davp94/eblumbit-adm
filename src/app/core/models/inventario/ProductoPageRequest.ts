export interface ProductoPageRequest {
    pageSize: number;
    pageNumber: number;
    sortField?: string;
    sortOrder?: string;
    filterValue?: string;
    nombre?: string;
    descripcion?: string;
    codigoBarra?: string;
    marca?: string;
    nombreCategoria?: string;
    almacenId?: number;
}