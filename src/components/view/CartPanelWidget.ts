import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { uiConfig } from '../../utils/constants';
import { cloneTpl } from './dom';

type CartRow = { id: string; title: string; price: number | null; index?: number };
type CartState = { items: CartRow[]; total: number | null; };

export class CartPanelWidget extends Component<CartState> {
  private root: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private state: CartState = { items: [], total: 0 };

  constructor(private readonly events?: IEvents, private opts?: { onRemove?: (id: string) => void; onCheckout?: () => void }) {
    const root = cloneTpl<HTMLElement>('basket');
    super(root);
    this.root = root;
    this.listEl = root.querySelector('.basket__list') as HTMLElement;
    this.totalEl = root.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = root.querySelector('.basket__button') as HTMLButtonElement;

    root.addEventListener('click', (e) => {
      const del = (e.target as HTMLElement).closest<HTMLButtonElement>('.basket__item-delete');
      if (del && this.root.contains(del)) {
        e.preventDefault();
        const id = del.dataset.id!;
        if (this.opts?.onRemove) this.opts.onRemove(id);
        else this.events?.emit?.('basket/remove', { id } as any); 
      }
      const checkout = (e.target as HTMLElement).closest<HTMLButtonElement>('.basket__button');
      if (checkout && this.root.contains(checkout)) {
        e.preventDefault();
        if (this.opts?.onCheckout) this.opts.onCheckout();
        else this.events?.emit?.('basket/checkout', {} as any);
       
      }
    });
  }

  setState(state: CartState) {
    this.state = state;
  }

  private formatPrice(p: number | null) {
    if (p === null) return uiConfig.labels.free;
    return `${p} ${uiConfig.labels.currency}`;
  }

  render(): HTMLElement {
    const { items, total } = this.state;
    const nodes = items.map((it) => {
      const node = cloneTpl<HTMLElement>('card-basket');
      node.querySelector('.basket__item-index')!.textContent = String(it.index ?? '');
      node.querySelector('.card__title')!.textContent = it.title;
      const priceEl = node.querySelector('.card__price') as HTMLElement | null;
      if (priceEl) priceEl.textContent = this.formatPrice(it.price);
      const delBtn = node.querySelector('.basket__item-delete') as HTMLButtonElement | null;
      if (delBtn) delBtn.dataset.id = it.id;
      return node;
    });
    this.listEl.replaceChildren(...nodes);
    this.totalEl.textContent = `${total} ${uiConfig.labels.currency}`;
    this.checkoutBtn.disabled = items.length === 0;
    return this.root;
  }
}
