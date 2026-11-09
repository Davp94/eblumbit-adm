export interface PageableResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}