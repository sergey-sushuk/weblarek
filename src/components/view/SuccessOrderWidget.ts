import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class SuccessOrderWidget extends Component<{ total: number | null }> {
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, total: number | null) {
    const root = cloneTemplate<HTMLElement>('#success');
    super(root);

    this.descriptionEl = ensureElement('.order-success__description', root);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', root);

    this.setTotal(total);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal/close');
    });
  }

  setTotal(total: number | null) {
    this.descriptionEl.textContent =
      total === null ? 'Списано бесплатно' : `Списано ${total} синапсов`;
  }

  render(): HTMLElement {
    return this.container;
  }
}
