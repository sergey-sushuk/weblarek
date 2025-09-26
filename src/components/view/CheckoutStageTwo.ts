import { FormViewBase } from './FormViewBase';
import { cloneTemplate, ensureElement } from '../../utils/utils';

type Step2State = {
  email: string;
  phone: string;
  error?: string;
  disablePay?: boolean;
};

type Step2Handlers = {
  onInput: (field: 'email' | 'phone', value: string) => void;
  onSubmit: () => void;
};

export class CheckoutStageTwo extends FormViewBase<Step2State> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(private handlers: Step2Handlers) {
    const form = cloneTemplate<HTMLFormElement>('#contacts');
    super(form);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);

    this.emailInput.addEventListener('input', (e) =>
      this.handlers.onInput('email', (e.target as HTMLInputElement).value)
    );
    this.phoneInput.addEventListener('input', (e) =>
      this.handlers.onInput('phone', (e.target as HTMLInputElement).value)
    );

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlers.onSubmit();
    });
  }

  setState(state: Step2State) {
    this.emailInput.value = state.email ?? '';
    this.phoneInput.value = state.phone ?? '';
    this.setError(state.error ?? '');
    this.setSubmitDisabled(Boolean(state.disablePay));
  }

  reset() {
    this.setState({ email: '', phone: '', error: '', disablePay: true });
  }
}
