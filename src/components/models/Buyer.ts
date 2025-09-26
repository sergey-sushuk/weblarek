import { Events } from '../base/Events';
import type { IBuyer } from '../../types';

export class Buyer extends Events {
  protected payment: 'card' | 'cash' | '' = '';
  protected email = '';
  protected phone = '';
  protected address = '';

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  saveOrderData(data: Partial<IBuyer>): void {
    if (typeof data.payment !== 'undefined') this.payment = data.payment;
    if (typeof data.email !== 'undefined') this.email = data.email;
    if (typeof data.phone !== 'undefined') this.phone = data.phone;
    if (typeof data.address !== 'undefined') this.address = data.address;
    this.emit('buyer:changed', this.getBuyerData());
  }

  clearBuyerData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('buyer:changed', this.getBuyerData());
  }

  validationData(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.address.trim()) errors.address = 'Введите адрес';
    if (!this.email.trim()) errors.email = 'Введите email';
    if (!this.phone.trim()) errors.phone = 'Введите телефон';
    return errors;
  }
}
