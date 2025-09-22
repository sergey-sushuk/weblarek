import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class OverlayModal extends Component<{ isOpen: boolean }> {
  private overlay: HTMLElement;
  private content: HTMLElement;
  private closeBtn: HTMLButtonElement;
  private lastActive: HTMLElement | null = null;

  constructor(private readonly events?: IEvents) {
    const overlay = document.getElementById('modal-container') as HTMLElement;
    if (!overlay) throw new Error('Modal container #modal-container not found');
    super(overlay);

    this.overlay = overlay;
    this.content = overlay.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = overlay.querySelector('.modal__close') as HTMLButtonElement;
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onClose = this.onClose.bind(this);
    this.closeBtn.addEventListener('click', this.onClose);
    this.overlay.addEventListener('click', this.onOverlayClick);
  }

  open(node: HTMLElement) {
    this.lastActive = document.activeElement as HTMLElement;
    this.content.replaceChildren(node);
    this.overlay.classList.add('modal_active');
    document.addEventListener('keydown', this.onKeydown);
  }

  close() {
    this.overlay.classList.remove('modal_active');
    this.content.replaceChildren();
    document.removeEventListener('keydown', this.onKeydown);
    this.events?.emit?.('modal/close', {} as any);
    this.lastActive?.focus?.();
  }

  private onOverlayClick(e: MouseEvent) {
    if (e.target === this.overlay) this.close();
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.close();
  }

  private onClose() {
    this.close();
  }
}
