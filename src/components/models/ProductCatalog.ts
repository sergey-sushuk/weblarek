import { Events } from '../base/Events';
import type { IProduct } from '../../types';

export class ProductCatalog extends Events {
  protected arrayProducts: IProduct[] = [];
  protected cardProduct?: IProduct;

  setArrayProducts(items: IProduct[]): void {
    this.arrayProducts = [...items];
    this.emit('catalog:changed', this.getArrayProducts());
  }

  getArrayProducts(): IProduct[] {
    return [...this.arrayProducts];
  }

  getProduct(id: string): IProduct {
    const product = this.arrayProducts.find((i) => i.id === id);
    if (!product) throw new Error(`Товар с ID ${id} не найден`);
    return product;
  }

  setProductForDisplay(product: IProduct): void {
    this.cardProduct = product;
    this.emit('product:selected', product.id);
  }

  getProductForDisplay(): IProduct {
    if (!this.cardProduct) throw new Error('Не выбран товар для отображения');
    return this.cardProduct;
  }
}
