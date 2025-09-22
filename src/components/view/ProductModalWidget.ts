import { CardView } from './CardView';
import type { Price } from '../../types';
import { cloneTpl } from './dom';

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
  private price!: Price;
  private inBasket: boolean = false;
  private btn!: HTMLButtonElement;

  constructor(private props: ModalProps, private onToggle: (id: string, inBasket: boolean) => void) {
    const root = cloneTpl<HTMLElement>('card-preview');
    super(root);

    this.titleEl = root.querySelector('.card__title') as HTMLElement;
    const descEl = root.querySelector('.card__text') as HTMLElement | null;
    const imgNode = root.querySelector('.card__image') as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;
    this.priceEl = root.querySelector('.card__price') as HTMLElement;
    this.categoryEl = root.querySelector('.card__category') as HTMLElement;
    this.btn = (root.querySelector('.card__button') as HTMLButtonElement) || document.createElement('button');

    this.id = props.id;
    this.price = props.price;
    this.inBasket = props.inBasket;
    this.setTitle(props.title);
    if (descEl) descEl.textContent = props.description ?? '';
    this.applyImage(props.image, props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);
    this.updateButton();

    this.btn.addEventListener('click', () => {
      if (this.price === null) return;
      this.inBasket = !this.inBasket;
      this.updateButton();
      this.onToggle(this.id, this.inBasket);
    });
  }

  private updateButton() {
    if (this.price === null) {
      this.btn.textContent = 'Недоступно';
      this.btn.disabled = true;
    } else {
      this.btn.textContent = this.inBasket ? 'Удалить из корзины' : 'Купить';
      this.btn.disabled = false;
    }
  }

  getElement() { return this.container; }
}
