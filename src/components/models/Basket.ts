import { IProduct } from '../../types/index.ts'

export class Basket {

  arrayProducts: IProduct[] = [];



  getArrayBasket(): IProduct[] {
    return [...this.arrayProducts];
  }

// Добавляет товар в корзину
 addProduct(product: IProduct): IProduct[] {
  this.arrayProducts.push(product);
  return this.arrayProducts;
  }

// Удаляет товар из корзины по его id
  delProduct(id: string): void {
    this.arrayProducts = this.arrayProducts.filter(item => item.id !== id);

  }
  
// Вычисляет общую стоимость товаров в корзине
  getTotalPrice(): number | null {
    return this.arrayProducts.reduce((total, product) => {
        return total + (product.price ?? 0);
    }, 0);
  }

    // Получает количество товаров в корзине
  getItemsCount(): number {
    return this.arrayProducts.length;
  }

// Проверяет, есть ли хотя бы один товар с таким id
  hasProduct(id: string): boolean {
    return this.arrayProducts.some(item => item.id === id)
  }

// Очищает корзину, удаляя все товары
    clearBasket(): void {
    this.arrayProducts = [];
  }

}