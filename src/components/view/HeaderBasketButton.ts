import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type HeaderState = { counter: number };

export class HeaderBasketButton extends Component<HeaderState> {
  private root: HTMLButtonElement;
  private counterEl: HTMLElement;
  private state: HeaderState = { counter: 0 };

  constructor(private readonly events?: IEvents) {
    const root = document.querySelector<HTMLButtonElement>('.header__basket');
    if (!root) throw new Error('HeaderBasketButton: .header__basket not found');
    super(root);
    this.root = root;
    this.counterEl = (root.querySelector('.header__basket-counter') as HTMLElement) || root;

    this.root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events?.emit?.('basket/open', {} as any);
    });
  }

  setState(state: HeaderState) {
    this.state = { counter: state.counter ?? 0 };
    this.counterEl.textContent = String(this.state.counter);
  }
}
