import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

type HeaderState = { counter: number };

export class HeaderBasketButton extends Component<HeaderState> {
  private counterEl: HTMLElement;

  constructor(onOpen: () => void) {
    const root = ensureElement<HTMLButtonElement>('.header__basket');
    super(root);
    this.counterEl = ensureElement('.header__basket-counter', root);

    root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onOpen();
    });
  }

  setState(state: HeaderState) {
    this.counterEl.textContent = String(state.counter ?? 0);
  }
}
