import './scss/styles.scss';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer ';
import { apiProducts } from './utils/data';
import { IBuyer } from './types';




// тест работы ProductCatalog 

const catalog = new ProductCatalog(apiProducts.items);
catalog.setArrayProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', catalog.getArrayProducts());
const product = catalog.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Объект товара с id: 854cef69-976d-4c2a-a18c-2aa45046c390', product);
catalog.setProductForDisplay(product);
console.log('Карточка товара для отображения: ', catalog.getProductForDisplay());

// тест работы Buyer
const user: IBuyer = {
    "payment": "card",
    "email": "test@mail.ru",
    "phone": "+7777777777",
    "address": "Сочи"
}
const buyer = new Buyer(user);
buyer.saveOrderData(user);
console.log('данные покупателя: ', buyer.getBuyerData());
console.log('проверка данных покупателя ', buyer.validationData());
buyer.clearBuyerData();
console.log('очистка данных покупателя', buyer.getBuyerData());
console.log('проверка данных покупателя после очистки  ', buyer.validationData());

// тест корзины

const basket = new Basket();
console.log('корзина пуста ', basket.getArrayBasket());
console.log('Вы добавили товар в корзину: ', basket.addProduct(product));
console.log('проверить еслить ли этот товар в корзине: ', basket.hasProduct('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('количество товаров: ', basket.getItemsCount());
console.log('Стоимость всех товаров ворзине: ', basket.getTotalPrice());
console.log('удалили этот товар : ', basket.delProduct('854cef69-976d-4c2a-a18c-2aa45046c390'));
basket.clearBasket();
console.log('Удалили все товары с корзины');
console.log('Текущая корзина:', basket.getArrayBasket());

