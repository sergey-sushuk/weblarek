import { CardView } from './CardView';
import type { Price } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export type ModalProps = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
};

export class ProductModalWidget extends CardView<ModalProps> {
  private id!: string;
  private btn: HTMLButtonElement;

  constructor(props: ModalProps, onToggle: (id: string, nextInBasket: boolean) => void) {
    const root = cloneTemplate<HTMLElement>('#card-preview');
    super(root);

    this.titleEl = ensureElement('.card__title', root);
    const descEl = root.querySelector('.card__text') as HTMLElement | null;
    if (descEl) descEl.textContent = props.description ?? '';

    const img = root.querySelector('.card__image');
    if (img instanceof HTMLImageElement) this.imgEl = img;
    else this.imgBoxEl = img as HTMLElement | undefined;

    this.priceEl = ensureElement('.card__price', root);
    this.categoryEl = ensureElement('.card__category', root);
    this.btn = ensureElement<HTMLButtonElement>('.card__button', root);

    this.btn.addEventListener('click', () => {
      if (props.price === null) return;           
      onToggle(this.id, !props.inBasket);            
    });

    this.setState(props);
  }

  setState(p: ModalProps) {
    this.id = p.id;
    this.setTitle(p.title);
    const descEl = this.container.querySelector('.card__text') as HTMLElement | null;
    if (descEl) descEl.textContent = p.description ?? '';

    this.applyImage(p.image, p.title);
    this.setPrice(p.price);
    this.setCategory(p.category);

    if (p.price === null) {
      this.btn.textContent = 'Недоступно';
      this.btn.disabled = true;
    } else {
      this.btn.disabled = false;
      this.btn.textContent = p.inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }

  render(): HTMLElement {
    return this.container;
  }
}
