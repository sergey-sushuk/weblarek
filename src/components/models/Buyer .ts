
import { IBuyer } from '../../types/index.ts'

export class Buyer implements IBuyer {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;

// Конструктор класса Buyer
  constructor(buyerData: IBuyer) {
    this.payment = buyerData.payment;
    this.email = buyerData.email;
    this.phone = buyerData.phone;
    this.address = buyerData.address;
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
  saveOrderData(buyerData: IBuyer): void {
    this.payment = buyerData.payment;
    this.email = buyerData.email;
    this.phone = buyerData.phone;
    this.address = buyerData.address;
  }

//   очистка данных покупателя 
  clearBuyerData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

// валидация 
  validationData(): boolean {
    if(!this.payment) {
      return false;
    }
    if(!this.email.trim()) {
      return false;
    }
    if(!this.phone.trim()) {
      return false;
    }
    if(!this.address.trim()) {
      return false;
    }
    return true;
  }
}
