import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { uiConfig } from '../../utils/constants';
import { CartItemRow, type CartItemProps } from './CartItemRow';

export class CartPanelWidget extends Component<unknown> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private emptyEl?: HTMLElement;

  constructor(private readonly events: IEvents) {
    const root = cloneTemplate<HTMLElement>('#basket');
    super(root);

    this.listEl = ensureElement('.basket__list', root);
    this.totalEl = ensureElement('.basket__price', root);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', root);
    this.emptyEl = (root.querySelector('.basket__empty') as HTMLElement) || undefined;

    this.checkoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('basket/checkout');
    });
  }

  setItems(items: CartItemProps[]) {
    const nodes = items.map((props) => new CartItemRow(this.events, props).render());
    this.listEl.replaceChildren(...nodes);

    const isEmpty = items.length === 0;
    this.checkoutButton.disabled = isEmpty;
    if (this.emptyEl) this.emptyEl.toggleAttribute('hidden', !isEmpty);
    this.listEl.toggleAttribute('hidden', isEmpty);
  }

  setTotal(total: number | null) {
    this.totalEl.textContent =
      total === null ? uiConfig.labels.free : `${total} ${uiConfig.labels.currency}`;
  }

  render(): HTMLElement {
    return this.container;
  }
}
