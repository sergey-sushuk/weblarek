import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { uiConfig } from '../../utils/constants';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export type CartRow = { id: string; title: string; price: number | null; index?: number };

export class CartPanelWidget extends Component<unknown> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;

  constructor(private readonly events: IEvents, opts?: { onCheckout?: () => void }) {
    const root = cloneTemplate<HTMLElement>('#basket');
    super(root);

    this.listEl = ensureElement('.basket__list', root);
    this.totalEl = ensureElement('.basket__price', root);
    this.checkoutBtn = ensureElement<HTMLButtonElement>('.basket__button', root);

   
    this.listEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.basket__item-delete');
      if (!btn || !this.listEl.contains(btn)) return;
      const id = btn.dataset.id;
      if (id) this.events.emit('basket/remove', { id });
    });

    this.checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      opts?.onCheckout ? opts.onCheckout() : this.events.emit('basket/checkout');
    });
  }

  setItems(items: CartRow[]) {
    const nodes = items.map((it, i) => {
      const node = cloneTemplate<HTMLElement>('#card-basket');
      ensureElement('.basket__item-index', node).textContent = String(it.index ?? i + 1);
      ensureElement('.card__title', node).textContent = it.title;
      ensureElement('.card__price', node).textContent =
        it.price === null ? uiConfig.labels.free : `${it.price} ${uiConfig.labels.currency}`;
      ensureElement<HTMLButtonElement>('.basket__item-delete', node).dataset.id = it.id;
      return node;
    });

    this.listEl.replaceChildren(...nodes);
    this.checkoutBtn.disabled = items.length === 0;
  }

  setTotal(total: number | null) {
    this.totalEl.textContent =
      total === null ? uiConfig.labels.free : `${total} ${uiConfig.labels.currency}`;
  }

  render(): HTMLElement {
    return this.container;
  }
}
