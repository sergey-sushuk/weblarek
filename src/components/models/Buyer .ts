
import { IBuyer } from '../../types/index.ts'

  export class Buyer {
  protected payment: 'card' | 'cash' | '';
  protected email: string;
  protected phone: string;
  protected address: string;


// Конструктор класса Buyer
  constructor() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }


//   возвращает текущие данные покупателя в виде объекта IBuyer
  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }
// обновляет данные покупателя


  saveOrderData(data: Partial<IBuyer>): void {
    if (typeof data.payment !== 'undefined') this.payment = data.payment;
    if (typeof data.email !== 'undefined') this.email = data.email;
    if (typeof data.phone !== 'undefined') this.phone = data.phone;
    if (typeof data.address !== 'undefined') this.address = data.address;
  }

//   очистка данных покупателя 
  clearBuyerData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

// валидация 
  validationData(): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (!this.payment) {
    errors.payment = 'Пожалуйста, выберите способ оплаты.';
  }
  if (!this.email.trim()) {
    errors.email = 'Пожалуйста, введите email.';
  }
  if (!this.phone.trim()) {
    errors.phone = 'Пожалуйста, введите номер телефона.';
  }
  if (!this.address.trim()) {
    errors.address = 'Пожалуйста, введите адрес.';
  }

  return errors; // если ошибок нет, объект будет пустым
}
}