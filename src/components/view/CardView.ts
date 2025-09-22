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
    const isBad = !src || /<%=?\s*require/.test(src);
    if (this.imgEl) {
      this.imgEl.src = isBad ? '' : src!;
      this.imgEl.alt = alt ?? '';
      if (!isBad) this.imgEl.removeAttribute('hidden');
      else this.imgEl.setAttribute('hidden', 'true');
    } else if (this.imgBoxEl) {
      if (isBad) {
        this.imgBoxEl.innerHTML = '<div class="card__image-placeholder"></div>';
      } else {
        this.imgBoxEl.innerHTML = `<img class="card__image" src="${src}" alt="${alt ?? ''}">`;
      }
    }
  }

  protected setCategory(c?: string) {
    if (!this.categoryEl) return;

    const text = c ?? '';
    const slug = c ? (categoryLut as any)[c] ?? 'other' : 'other';
    this.categoryEl.textContent = text;
    for (const cls of Array.from(this.categoryEl.classList)) {
      if (cls.startsWith('card__category_')) this.categoryEl.classList.remove(cls);
    }
    this.categoryEl.classList.add(`card__category_${slug}`);
   
    const mod = c ? `card__category_${c.replace(/\s+/g, '-').toLowerCase()}` : 'card__category_other';
    this.categoryEl.classList.add(mod);
  }

  protected setPrice(price: Price | IProduct) {
    if (!this.priceEl) return;
    const v: Price = (price && typeof price === 'object') ? (price as IProduct).price : (price as Price);
    this.priceEl.textContent = v === null ? uiConfig.labels.free : `${v} ${uiConfig.labels.currency}`;
  }
}
