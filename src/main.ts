import './scss/styles.scss';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer ';
import type { IProduct } from './types';

import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ApiComposition } from './components/api/ApiComposition';


import { OverlayModal } from './components/view/OverlayModal';
import { HeaderBasketButton } from './components/view/HeaderBasketButton';
import { CatalogGrid } from './components/view/CatalogGrid';
import { ProductModalWidget } from './components/view/ProductModalWidget';
import { CartPanelWidget } from './components/view/CartPanelWidget';
import { CheckoutStageOne } from './components/view/CheckoutStageOne';
import { CheckoutStageTwo } from './components/view/CheckoutStageTwo';


const productsModel = new ProductCatalog();
const cartModel = new Basket();
const buyerModel = new Buyer();


const modal = new OverlayModal();
const headerCart = new HeaderBasketButton();
const catalog = new CatalogGrid(openPreview);
const cartPanel = new CartPanelWidget(undefined, {
  onRemove: (id: string) => { cartModel.delProduct(id); renderCatalog(); openCart(); },
  onCheckout: () => { modal.open(orderStep1.render()); }
});
const orderStep1 = new CheckoutStageOne(({ payment, address }) => {

  (buyerModel as any).setBuyerData ? (buyerModel as any).setBuyerData({ payment, address }) : Object.assign(buyerModel as any, { payment, address });
  modal.open(orderStep2.render());
});
const orderStep2 = new CheckoutStageTwo(async ({ email, phone }) => {
  (buyerModel as any).setBuyerData ? (buyerModel as any).setBuyerData({ email, phone }) : Object.assign(buyerModel as any, { email, phone });
  if ((buyerModel as any).validate && !(buyerModel as any).validate()) return;
  await createOrderAndShowSuccess();
});

function makeImg(src?: string) {
  if (!src) return undefined;
  const file = src.replace(/^\/?images\//i, '').replace(/^\//, '');
  return `${CDN_URL}/${file}`;
}

function renderCatalog() {
  const items = productsModel.getArrayProducts().map((p: IProduct) => ({
    id: p.id,
    title: p.title,
    image: makeImg(p.image),
    price: p.price,
    inBasket: cartModel.hasProduct(p.id),
    category: p.category,
  }));
  catalog.setState({ items });
  headerCart.setState({ counter: cartModel.getItemsCount() });
}

function openPreview(id: string) {
  const p = productsModel.getProduct(id);
  const preview = new ProductModalWidget(
    {
      id: p.id,
      title: p.title,
      description: p.description,
      image: makeImg(p.image),
      price: p.price,
      inBasket: cartModel.hasProduct(p.id),
      category: p.category,
    },
    (pid, inBasket) => {
      if (inBasket) cartModel.addProduct(p);
      else cartModel.delProduct(pid);
      renderCatalog();
    }
  );
  modal.open(preview.getElement());
}

function openCart() {
  const items = cartModel.getArrayBasket();
  cartPanel.setState({
    items: items.map((it, i) => ({ id: it.id, title: it.title, price: it.price, index: i + 1 })),
    total: cartModel.getTotalPrice(),
  });
  modal.open(cartPanel.render());
}


document.querySelector('.header__basket')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCart();
});

async function createOrderAndShowSuccess() {
  const payload: any = {
    payment: (buyerModel as any).payment,
    address: (buyerModel as any).address,
    email: (buyerModel as any).email,
    phone: (buyerModel as any).phone,
    items: cartModel.getArrayBasket().map((i) => i.id),
    total: cartModel.getTotalPrice(),
  };
  const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
  const service = new ApiComposition(api);
  try {
    await service.createOrder(payload);
    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const amountEl = node.querySelector('.order-success__description') as HTMLElement;
    if (amountEl) amountEl.textContent = `Списано ${cartModel.getTotalPrice()} синапсов`;
    const closeBtn = node.querySelector('.order-success__close') as HTMLButtonElement;
    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
    modal.open(node);
    cartModel.clearBasket();
    headerCart.setState({ counter: 0 });
  } catch (e) {
    console.error('Не удалось оформить заказ:', e);
  }
}


(async () => {
  try {
    const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
    const service = new ApiComposition(api);
    const items = await service.getProducts();
    productsModel.setArrayProducts(items);
    renderCatalog();
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
})();
