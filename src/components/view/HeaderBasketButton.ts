import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type HeaderState = { counter: number };

export class HeaderBasketButton extends Component<HeaderState> {
  private counterEl: HTMLElement;

  constructor(private readonly events: IEvents, root: HTMLButtonElement) {
    super(root);
    this.counterEl = ensureElement('.header__basket-counter', root);

    root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('basket/open');
    });
  }

  setState(state: HeaderState) {
    this.counterEl.textContent = String(state.counter ?? 0);
  }
}
