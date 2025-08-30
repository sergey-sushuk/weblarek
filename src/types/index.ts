export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
// интерфейс каталога товаров 
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
// интерфейс покупателя
export interface IBuyer  {
 payment: TPayment;
 email: string ;
 phone: string;
 address: string;
}

// тип метода оплаты
export type TPayment = 'card' | 'cash' | ''; 

