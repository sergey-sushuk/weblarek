import { Events } from '../base/Events';
import type { IProduct } from '../../types';

export class Basket extends Events {
  protected arrayProducts: IProduct[] = [];

  getArrayBasket(): IProduct[] {
    return [...this.arrayProducts];
  }

  addProduct(product: IProduct): IProduct[] {
    this.arrayProducts.push(product);
    this.emit('basket:changed', this.getArrayBasket());
    return this.arrayProducts;
  }

  delProduct(id: string): void {
    this.arrayProducts = this.arrayProducts.filter((item) => item.id !== id);
    this.emit('basket:changed', this.getArrayBasket());
  }

  getTotalPrice(): number | null {
    return this.arrayProducts.reduce((total, product) => total + (product.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this.arrayProducts.length;
  }

  hasProduct(id: string): boolean {
    return this.arrayProducts.some((item) => item.id === id);
  }

  clearBasket(): void {
    this.arrayProducts = [];
    this.emit('basket:changed', this.getArrayBasket());
  }
}
