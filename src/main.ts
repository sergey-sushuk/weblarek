import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ApiComposition } from './components/api/ApiComposition';
import { API_URL, CDN_URL } from './utils/constants';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import type { IBuyer, IProduct, TPayment } from './types';

import { OverlayModal } from './components/view/OverlayModal';
import { HeaderBasketButton } from './components/view/HeaderBasketButton';
import { CatalogGrid } from './components/view/CatalogGrid';
import { ProductTileWidget } from './components/view/ProductTileWidget';
import { ProductModalWidget } from './components/view/ProductModalWidget';
import { CartPanelWidget } from './components/view/CartPanelWidget';
import { CheckoutStageOne } from './components/view/CheckoutStageOne';
import { CheckoutStageTwo } from './components/view/CheckoutStageTwo';
import { SuccessOrderWidget } from './components/view/SuccessOrderWidget';
import { ensureElement } from './utils/utils';
import { Events } from './components/base/Events';

const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
const service = new ApiComposition(api);

const productsModel = new ProductCatalog();
const cartModel = new Basket();
const buyerModel = new Buyer();

const bus = new Events();

let modal: OverlayModal;
let headerCart: HeaderBasketButton;
let catalog: CatalogGrid;
let cartPanel: CartPanelWidget;
let orderStep1: CheckoutStageOne;
let orderStep2: CheckoutStageTwo;

function resolveCdnImage(src?: string) {
  if (!src) return undefined;
  const file = src.replace(/^\/?images\//i, '').replace(/^\//, '');
  return `${CDN_URL}/${file}`;
}

function renderCatalog() {
  const products = productsModel.getArrayProducts();
  const tiles = products.map((product: IProduct) =>
    new ProductTileWidget(
      {
        id: product.id,
        title: product.title,
        image: resolveCdnImage(product.image),
        price: product.price,
        category: product.category,
        inBasket: cartModel.hasProduct(product.id),
      },
      { onOpen: openPreview }
    ).render()
  );
  catalog.setChildren(tiles);
  headerCart.setState({ counter: cartModel.getItemsCount() });
}

function openPreview(productId: string) {
  const product = productsModel.getProduct(productId);
  const preview = new ProductModalWidget(
    {
      id: product.id,
      title: product.title,
      description: product.description,
      image: resolveCdnImage(product.image),
      price: product.price,
      inBasket: cartModel.hasProduct(product.id),
      category: product.category,
    },
    (id: string, nextInBasket: boolean) => {
      const products = productsModel.getProduct(id);
      if (nextInBasket) cartModel.addProduct(products);
      else cartModel.delProduct(id);
      modal.close(); 
    }
  );
  modal.open(preview.render());
}

function openCart() {
  const items = cartModel.getArrayBasket();
  cartPanel.setItems(
    items.map((it, i) => ({ id: it.id, title: it.title, price: it.price, index: i + 1 }))
  );
  cartPanel.setTotal(cartModel.getTotalPrice());
  modal.open(cartPanel.render());
}

async function createOrderAndShowSuccess() {
  const buyer = buyerModel.getBuyerData();
  const payload = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: cartModel.getArrayBasket().map((i) => i.id),
    total: cartModel.getTotalPrice(),
  };

  await service.createOrder(payload);

  const success = new SuccessOrderWidget(bus, payload.total);
  modal.open(success.render());

  // очистка состояния после успешной оплаты
  cartModel.clearBasket();
  buyerModel.clearBuyerData();
  headerCart.setState({ counter: 0 });
}

function bootstrap() {
  const modalRoot = ensureElement<HTMLElement>('#modal-container');
  modal = new OverlayModal(modalRoot);

  const headerRoot = ensureElement<HTMLButtonElement>('.header__basket');
  headerCart = new HeaderBasketButton(bus, headerRoot);

  const gridRoot = ensureElement<HTMLElement>('.gallery');
  catalog = new CatalogGrid(gridRoot);

  cartPanel = new CartPanelWidget(bus);


  orderStep1 = new CheckoutStageOne({
    onPaymentSelect: (method: TPayment) => bus.emit('checkout:stage1:payment', { method }),
    onAddressInput: (address: string) => bus.emit('checkout:stage1:address', { address }),
    onSubmit: () => bus.emit('checkout:stage1:submit'),
  });

  orderStep2 = new CheckoutStageTwo({
    onInput: (field, value) => bus.emit('checkout:stage2:input', { field, value }),
    onSubmit: () => bus.emit('checkout:stage2:submit'),
  });


  bus.on('basket/open', () => openCart());
  bus.on('basket/checkout', () => {
  
    const buyer = buyerModel.getBuyerData();
    const errors = buyerModel.validationData();
    orderStep1.setState({
      payment: (buyer.payment || '') as '' | TPayment,
      address: buyer.address || '',
      error: errors.payment ?? errors.address ?? '',
      disableNext: Boolean(errors.payment || errors.address),
    });
    modal.open(orderStep1.render());
  });

  bus.on('modal/close', () => modal.close());

  bus.on('product:open', (payload?: unknown) => {
    const { id } = (payload ?? {}) as { id: string };
    if (id) openPreview(id);
  });

  
  bus.on('basket/remove', (payload?: unknown) => {
    const { id } = (payload ?? {}) as { id: string };
    if (id) cartModel.delProduct(id);
  });


  bus.on('checkout:stage1:payment', (payload?: unknown) => {
    const { method } = (payload ?? {}) as { method: TPayment };
    if (!method) return;
    buyerModel.saveOrderData({ payment: method });
    const errors = buyerModel.validationData();
    const buyer = buyerModel.getBuyerData();
    orderStep1.setState({
      payment: (buyer.payment || '') as '' | TPayment,
      address: buyer.address || '',
      error: errors.payment ?? errors.address ?? '',
      disableNext: Boolean(errors.payment || errors.address),
    });
  });

 
  bus.on('checkout:stage1:address', (payload?: unknown) => {
    const { address } = (payload ?? {}) as { address: string };
    buyerModel.saveOrderData({ address });
    const errors = buyerModel.validationData();
    const buyer = buyerModel.getBuyerData();
    orderStep1.setState({
      payment: (buyer.payment || '') as '' | TPayment,
      address: buyer.address || '',
      error: errors.payment ?? errors.address ?? '',
      disableNext: Boolean(errors.payment || errors.address),
    });
  });


  bus.on('checkout:stage1:submit', () => {
    const errors = buyerModel.validationData();
    if (errors.payment || errors.address) {
      const buyer = buyerModel.getBuyerData();
      orderStep1.setState({
        payment: (buyer.payment || '') as '' | TPayment,
        address: buyer.address || '',
        error: errors.payment ?? errors.address ?? '',
        disableNext: true,
      });
      return;
    }
    const buyer = buyerModel.getBuyerData();
    const errs = buyerModel.validationData();
    orderStep2.setState({
      email: buyer.email || '',
      phone: buyer.phone || '',
      error: errs.email ?? errs.phone ?? '',
      disablePay: Boolean(errs.email || errs.phone),
    });
    modal.open(orderStep2.render());
  });

 
  bus.on('checkout:stage2:input', (payload?: unknown) => {
    const { field, value } = (payload ?? {}) as { field: 'email' | 'phone'; value: string };
    if (!field) return;
    buyerModel.saveOrderData({ [field]: value } as Partial<IBuyer>);
    const errors = buyerModel.validationData();
    const buyer = buyerModel.getBuyerData();
    orderStep2.setState({
      email: buyer.email,
      phone: buyer.phone,
      error: errors.email ?? errors.phone ?? '',
      disablePay: Boolean(errors.email || errors.phone),
    });
  });

 
  bus.on('checkout:stage2:submit', async () => {
    const errors = buyerModel.validationData();
    if (errors.email || errors.phone) {
      const buyer = buyerModel.getBuyerData();
      orderStep2.setState({
        email: buyer.email,
        phone: buyer.phone,
        error: errors.email ?? errors.phone ?? '',
        disablePay: true,
      });
      return;
    }
    await createOrderAndShowSuccess();
  });


  productsModel.on('catalog:changed', renderCatalog);

  cartModel.on('basket:changed', () => {
    headerCart.setState({ counter: cartModel.getItemsCount() });
  
    const isCartOpen = !!document.querySelector('.modal.modal_active .basket');
    if (isCartOpen) openCart();
   
    renderCatalog();
  });

  (async () => {
    try {
      const items = await service.getProducts();
      productsModel.setArrayProducts(items);
    } catch (e) {
      console.error('Ошибка загрузки каталога:', e);
    }
  })();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
