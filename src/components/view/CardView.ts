import { Component } from '../base/Component';
import type { Price, IProduct } from '../../types';
import { categoryLut, uiConfig } from '../../utils/constants';

export abstract class CardView<T> extends Component<T> {
  protected titleEl?: HTMLElement;
  protected priceEl?: HTMLElement;
  protected categoryEl?: HTMLElement;
  protected imgEl?: HTMLImageElement;
  protected imgBoxEl?: HTMLElement;

  protected setTitle(text?: string) {
    if (this.titleEl) this.titleEl.textContent = text ?? '';
  }

 
  protected applyImage(src?: string, alt?: string) {
    if (this.imgEl) {
      this.imgEl.src = src ?? '';
      this.imgEl.alt = alt ?? '';
      return;
    }
    if (this.imgBoxEl) {
      const img = this.imgBoxEl.querySelector('img') as HTMLImageElement | null;
      if (img) {
        img.src = src ?? '';
        img.alt = alt ?? '';
      }
    }
  }

  protected setCategory(category?: string) {
    if (!this.categoryEl) return;

    this.categoryEl.textContent = category ?? '';

    // очищаем предыдущие модификаторы
    Array.from(this.categoryEl.classList)
      .filter((c) => c.startsWith('card__category_'))
      .forEach((c) => this.categoryEl!.classList.remove(c));

    
    const slug = category ? (categoryLut as Record<string, string>)[category] ?? 'other' : 'other';
    this.categoryEl.classList.add(`card__category_${slug}`);
  }

  
  protected setPrice(price: Price | IProduct) {
    if (!this.priceEl) return;

    const v: Price =
      price && typeof (price as any) === 'object' && 'price' in (price as any)
        ? ((price as any).price as Price)
        : (price as Price);

    this.priceEl.textContent =
      v === null ? uiConfig.labels.free : `${v} ${uiConfig.labels.currency}`;
  }
}
