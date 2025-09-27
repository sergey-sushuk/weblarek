import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class OverlayModal extends Component<unknown> {
  private contentEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(root: HTMLElement) {
    super(root);
    this.contentEl = ensureElement('.modal__content', root);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', root);

    root.addEventListener('click', (e) => {
      if (e.target === root) this.close();
    });
    this.closeButton.addEventListener('click', () => this.close());
  }

  open(node: HTMLElement) {
    this.contentEl.replaceChildren(node);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentEl.replaceChildren();
  }
}
