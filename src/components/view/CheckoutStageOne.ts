import { FormViewBase } from './FormViewBase';
import type { TPayment } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

type Step1State = {
  payment: TPayment | null;
  address: string;
  error?: string;
  disableNext?: boolean;
};

type Step1Handlers = {
  onPaymentSelect: (mode: TPayment) => void;
  onAddressInput: (address: string) => void;
  onSubmit: () => void;
};

export class CheckoutStageOne extends FormViewBase<Step1State> {
  private addressInput: HTMLInputElement;
  private payCardBtn: HTMLButtonElement;
  private payCashBtn: HTMLButtonElement;

  constructor(private handlers: Step1Handlers) {
    const form = cloneTemplate<HTMLFormElement>('#order');
    super(form);

    this.payCardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', form);
    this.payCashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', form);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', form);

    this.payCardBtn.type = 'button';
    this.payCashBtn.type = 'button';

    this.payCardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handlers.onPaymentSelect('card');
    });
    this.payCashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handlers.onPaymentSelect('cash');
    });
    this.addressInput.addEventListener('input', (e) => {
      this.handlers.onAddressInput((e.target as HTMLInputElement).value);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlers.onSubmit();
    });
  }

  setState(state: Step1State) {
    this.payCardBtn.classList.toggle('button_alt-active', state.payment === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', state.payment === 'cash');
    this.addressInput.value = state.address ?? '';
    this.setError(state.error ?? '');
    this.setSubmitDisabled(Boolean(state.disableNext));
  }

  reset() {
    this.setState({ payment: null, address: '', error: '', disableNext: true });
  }
}
