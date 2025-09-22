
import { FormViewBase } from './FormViewBase';
import type { TPayment } from '../../types';
import { cloneTpl } from './dom';

type State = { payment: TPayment | null; address: string; errors?: Record<string,string> };

export class CheckoutStageOne extends FormViewBase<State> {
  private addressInput: HTMLInputElement;
  private payCardBtn: HTMLButtonElement;
  private payCashBtn: HTMLButtonElement;
  private state: State = { payment: null, address: '', errors: {} };

  constructor(private onNext: (data: { payment: 'card'|'cash'; address: string }) => void) {
    const form = cloneTpl<HTMLFormElement>('order');
    super(form);

    this.payCardBtn   = form.querySelector('button[name="card"]')  as HTMLButtonElement;
    this.payCashBtn   = form.querySelector('button[name="cash"]')  as HTMLButtonElement;
    this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;


    this.payCardBtn.type = 'button';
    this.payCashBtn.type = 'button';

    const setPayment = (m: TPayment) => {
      this.state.payment = m;

      this.payCardBtn.classList.toggle('button_alt-active', m === 'card');
      this.payCashBtn.classList.toggle('button_alt-active', m === 'cash');
      this.validate();
    };


    form.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>('button[name="card"], button[name="cash"]');
      if (!btn || !form.contains(btn)) return;

      e.preventDefault();
      setPayment(btn.name as TPayment); // 'card' | 'cash'
    });

    this.addressInput.addEventListener('input', (e: Event) => {
      this.state.address = (e.target as HTMLInputElement).value;
      this.validate();
    });

    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.validate();
      if (this.state.payment && this.state.address.trim()) {
        this.onNext({ payment: this.state.payment as 'card'|'cash', address: this.state.address });
      }
    });
  }

  override render(): HTMLElement {

    this.payCardBtn.classList.toggle('button_alt-active', this.state.payment === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', this.state.payment === 'cash');
    this.setSubmitDisabled(this.hasErrors());
    return this.form;
  }

  private hasErrors() {
    return Boolean(this.state.errors?.payment || this.state.errors?.address);
  }

  private validate() {
    const errors: State['errors'] = {};
    if (!this.state.payment) errors!.payment = 'Выберите способ оплаты';
    if (!this.state.address || !this.state.address.trim()) errors!.address = 'Введите адрес';
    this.state.errors = errors;
    this.setError(errors?.payment || errors?.address || '');
    this.setSubmitDisabled(this.hasErrors());
  }
}
