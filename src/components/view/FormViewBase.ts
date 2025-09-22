import { Component } from '../base/Component';

export abstract class FormViewBase<TState extends object> extends Component<TState> {
  protected form: HTMLFormElement;
  protected submitBtn?: HTMLButtonElement;
  protected errorsEl?: HTMLElement;

  constructor(form: HTMLFormElement) {
    super(form);
    this.form = form;


    this.submitBtn = this.form.querySelector('button[type="submit"]') as HTMLButtonElement | null || undefined;
    this.errorsEl  = this.form.querySelector('.form__errors') as HTMLElement | null || undefined;
  }

  protected setSubmitDisabled(disabled: boolean) {
    if (this.submitBtn) this.submitBtn.disabled = disabled;
  }

  protected setError(message: string) {
    if (this.errorsEl) this.errorsEl.textContent = message;
  }
}
