
import { IApi, IProductsResponse, IOrderRequest, IProduct, IOrderResponse } from '../../types';

class ApiComposition {

  constructor(private api: IApi) { }

  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<IProductsResponse>('/product/');
    return res.items;
  }

  async createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    const res = await this.api.post<IOrderResponse>('/order/', payload, 'POST');
    return res;
  }
}
export { ApiComposition }