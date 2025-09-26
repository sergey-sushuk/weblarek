import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class OverlayModal extends Component<unknown> {
  private content: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(root: HTMLElement) {
    super(root);
    this.content = ensureElement('.modal__content', root);
    this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', root);

    root.addEventListener('click', (e) => {
      if (e.target === root) this.close();
    });
    this.closeBtn.addEventListener('click', () => this.close());
  }

  open(node: HTMLElement, opts: { clone?: boolean } = {}) {
    const content = opts.clone ? (node.cloneNode(true) as HTMLElement) : node;
    this.content.replaceChildren(content);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content.replaceChildren();
  }
}
