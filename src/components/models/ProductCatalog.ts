import { IProduct } from '../../types/index.ts'

// Класс, представляющий каталог товаров
export class ProductCatalog {
 private arrayProducts: IProduct[] = [];
  cardProduct!: IProduct;


  setArrayProducts(arrayProducts: IProduct[]): void {
    this.arrayProducts = [...arrayProducts];
  }


  getArrayProducts(): IProduct[] {
    return [...this.arrayProducts];
  }

 // Поиск товара по ID в массиве
  getProduct(id: string): IProduct {
    const product = this.arrayProducts.find(item => item.id === id);
    
    if (!product) {
      throw new Error(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  // Создает копию переданного товара для отображения
  setProductForDisplay(cardProduct: IProduct): void {
    this.cardProduct = { ...cardProduct };
  }

 // Возвращает текущий товар для отображения
  getProductForDisplay(): IProduct { 
    return this.cardProduct; 
  }
}
