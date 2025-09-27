import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { uiConfig } from '../../utils/constants';

export type CartItemProps = {
  id: string;
  title: string;
  price: number | null;
  index?: number;
};

export class CartItemRow extends Component<CartItemProps> {
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, props: CartItemProps) {
    const root = cloneTemplate<HTMLElement>('#card-basket');
    super(root);

    this.indexEl = ensureElement('.basket__item-index', root);
    this.titleEl = ensureElement('.card__title', root);
    this.priceEl = ensureElement('.card__price', root);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', root);

    this.setState(props);

    this.deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      const id = this.deleteButton.dataset.id!;
      this.events.emit('basket/remove', { id });
    });
  }

  setState(state: CartItemProps) {
    this.indexEl.textContent = String(state.index ?? '');
    this.titleEl.textContent = state.title;

    this.priceEl.textContent =
      state.price === null ? uiConfig.labels.free : `${state.price} ${uiConfig.labels.currency}`;

    this.deleteButton.dataset.id = state.id;
  }

  render(): HTMLElement {
    return this.container;
  }
}
