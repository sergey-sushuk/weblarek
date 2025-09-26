import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ApiComposition } from './components/api/ApiComposition';
import { API_URL, CDN_URL } from './utils/constants';

import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import type { IProduct,  TPayment } from './types';

import { Events } from './components/base/Events';           
import { OverlayModal } from './components/view/OverlayModal';
import { HeaderBasketButton } from './components/view/HeaderBasketButton';
import { CatalogGrid } from './components/view/CatalogGrid';
import { ProductTileWidget } from './components/view/ProductTileWidget';
import { ProductModalWidget } from './components/view/ProductModalWidget';
import { CartPanelWidget } from './components/view/CartPanelWidget';
import { CheckoutStageOne } from './components/view/CheckoutStageOne';
import { CheckoutStageTwo } from './components/view/CheckoutStageTwo';
import { ensureElement } from './utils/utils';

// ---- сервисы
const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
const service = new ApiComposition(api);

// ---- модели
const productsModel = new ProductCatalog();
const cartModel = new Basket();
const buyerModel = new Buyer();

// ---- события
const bus = new Events();

// ---- представления (инициализируются в bootstrap)
let modal: OverlayModal;
let headerCart: HeaderBasketButton;
let catalog: CatalogGrid;
let cartPanel: CartPanelWidget;
let orderStep1: CheckoutStageOne;
let orderStep2: CheckoutStageTwo;

function makeImg(src?: string) {
  if (!src) return undefined;
  const file = src.replace(/^\/?images\//i, '').replace(/^\//, '');
  return `${CDN_URL}/${file}`;
}

// рендер каталога по событию модели
function renderCatalog() {
  const items = productsModel.getArrayProducts();

  const nodes = items.map((p: IProduct) =>
    new ProductTileWidget(
      {
        id: p.id,
        title: p.title,
        image: makeImg(p.image),
        price: p.price,
        category: p.category,
        inBasket: cartModel.hasProduct(p.id),
      },
      { onOpen: openPreview }                              // <- передаём объект с onOpen
    ).render()
  );

  catalog.setChildren(nodes);
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
    (pid, nextInBasket) => {
      const prod = productsModel.getProduct(pid);
      if (nextInBasket) cartModel.addProduct(prod);
      else cartModel.delProduct(pid);

      // перерисуем каталог и модалку с актуальными данными
      renderCatalog();

      const upd = new ProductModalWidget(
        {
          id: prod.id,
          title: prod.title,
          description: prod.description,
          image: makeImg(prod.image),
          price: prod.price,
          inBasket: cartModel.hasProduct(prod.id),
          category: prod.category,
        },
        (pid2, next2) => {
          const prod2 = productsModel.getProduct(pid2);
          if (next2) cartModel.addProduct(prod2);
          else cartModel.delProduct(pid2);
          renderCatalog();
          openPreview(pid2);
        }
      );

      modal.open(upd.render(), { clone: false });
    }
  );

  modal.open(preview.render(), { clone: false });          // <- НЕТ .getElement()
}

function openCart() {
  const items = cartModel.getArrayBasket();

  cartPanel.setItems(
    items.map((it, i) => ({ id: it.id, title: it.title, price: it.price, index: i + 1 }))
  );
  cartPanel.setTotal(cartModel.getTotalPrice());
  modal.open(cartPanel.render(), { clone: false });
}

async function createOrderAndShowSuccess() {
  const d = buyerModel.getBuyerData();
  const payload = {
    payment: d.payment,
    address: d.address,
    email: d.email,
    phone: d.phone,
    items: cartModel.getArrayBasket().map((i) => i.id),
    total: cartModel.getTotalPrice(),
  };

  await service.createOrder(payload);

  const tpl = ensureElement<HTMLTemplateElement>('#success');
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const totalText =
    payload.total === null ? 'Списано бесплатно' : `Списано ${payload.total} синапсов`;
  const amountEl = node.querySelector('.order-success__description') as HTMLElement | null;
  if (amountEl) amountEl.textContent = totalText;

  const closeBtn = node.querySelector('.order-success__close') as HTMLButtonElement | null;
  closeBtn?.addEventListener('click', () => modal.close());

  modal.open(node, { clone: false });

  // сброс
  cartModel.clearBasket();
  buyerModel.clearBuyerData();
  headerCart.setState({ counter: 0 });
}

function bootstrap() {
  const modalRoot = ensureElement<HTMLElement>('#modal-container');
  modal = new OverlayModal(modalRoot);

  headerCart = new HeaderBasketButton(openCart);          // <- передаём колбэк, не объект

  const gridRoot = ensureElement<HTMLElement>('.gallery');
  catalog = new CatalogGrid(gridRoot);

  cartPanel = new CartPanelWidget(bus, {                  // <- только onCheckout
    onCheckout: () => modal.open(orderStep1.render(), { clone: false }),
  });

  orderStep1 = new CheckoutStageOne({
    onPaymentSelect: (m: TPayment) => {
      buyerModel.saveOrderData({ payment: m });
      const errs = buyerModel.validationData();
      const d = buyerModel.getBuyerData();
      orderStep1.setState({
        payment: d.payment || null,
        address: d.address || '',
        error: errs.payment ?? errs.address,
        disableNext: Boolean(errs.payment || errs.address),
      });
    },
    onAddressInput: (address: string) => {
      buyerModel.saveOrderData({ address });
      const errs = buyerModel.validationData();
      const d = buyerModel.getBuyerData();
      orderStep1.setState({
        payment: d.payment || null,
        address: d.address || '',
        error: errs.payment ?? errs.address,
        disableNext: Boolean(errs.payment || errs.address),
      });
    },
    onSubmit: () => {
      const errs = buyerModel.validationData();
      if (errs.payment || errs.address) {
        const d = buyerModel.getBuyerData();
        orderStep1.setState({
          payment: d.payment || null,
          address: d.address || '',
          error: errs.payment ?? errs.address,
          disableNext: true,
        });
        return;
      }
      modal.open(orderStep2.render(), { clone: false });
    },
  });

  orderStep2 = new CheckoutStageTwo({
    onInput: (field, value) => {
      buyerModel.saveOrderData({ [field]: value } as any);
      const errs = buyerModel.validationData();
      const d = buyerModel.getBuyerData();
      orderStep2.setState({
        email: d.email,
        phone: d.phone,
        error: errs.email ?? errs.phone,
        disablePay: Boolean(errs.email || errs.phone),
      });
    },
    onSubmit: async () => {
      const errs = buyerModel.validationData();
      if (errs.email || errs.phone) {
        const d = buyerModel.getBuyerData();
        orderStep2.setState({
          email: d.email,
          phone: d.phone,
          error: errs.email ?? errs.phone,
          disablePay: true,
        });
        return;
      }
      await createOrderAndShowSuccess();
    },
  });

  // связи
  productsModel.on('catalog:changed', renderCatalog);

  // удаление из корзины через EventBus (кнопка удаления висит в CartPanelWidget)
  bus.on('basket/remove', ({ id }: { id: string }) => {
    cartModel.delProduct(id);
    openCart();
    renderCatalog();
  });

  // загрузка каталога
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
