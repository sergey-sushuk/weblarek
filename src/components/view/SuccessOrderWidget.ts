import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class SuccessOrderWidget extends Component<{ amountText: string }> {
  private textEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(amountText: string, onClose: () => void) {
    const root = cloneTemplate<HTMLElement>('#success');
    super(root);
    this.textEl = ensureElement('.order-success__description', root);
    this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', root);

    this.textEl.textContent = amountText;
    this.closeBtn.addEventListener('click', onClose);
  }

  render(): HTMLElement {
    return this.container;
  }
}
