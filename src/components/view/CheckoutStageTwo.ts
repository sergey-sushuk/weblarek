import { FormViewBase } from './FormViewBase';
import { cloneTpl } from './dom';

type State = { email: string; phone: string; errors?: Record<string,string> };

export class CheckoutStageTwo extends FormViewBase<State> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private state: State = { email: '', phone: '', errors: {} };

  constructor(private onPay: (data: { email: string; phone: string }) => void) {
    const form = cloneTpl<HTMLFormElement>('contacts');
    super(form);

    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null || undefined;
    this.errorsEl  = form.querySelector('.form__errors') as HTMLElement | null || undefined;

    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;

    this.emailInput.addEventListener('input', (e: Event) => {
      this.state.email = (e.target as HTMLInputElement).value;
      this.validate();
    });
    this.phoneInput.addEventListener('input', (e: Event) => {
      this.state.phone = (e.target as HTMLInputElement).value;
      this.validate();
    });

    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.validate();
      if (!this.hasErrors()) {
        this.onPay({ email: this.state.email, phone: this.state.phone });
      }
    });

    // первичная валидация
    this.validate();
  }

  private hasErrors(): boolean {
    return Boolean(this.state.errors && (this.state.errors.email || this.state.errors.phone));
  }

  private validate() {
    const errors: State['errors'] = {};

    if (!this.state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
      errors!.email = 'Введите корректный e-mail';
    }
    if (!this.state.phone || this.state.phone.replace(/\D/g, '').length < 10) {
      errors!.phone = 'Введите телефон (не менее 10 цифр)';
    }
    this.state.errors = errors;
    const msg = errors?.email || errors?.phone || '';
    this.setError(msg);
    this.setSubmitDisabled(Boolean(msg));
  }

  override render(): HTMLElement {
 
    return this.form;
  }
}
