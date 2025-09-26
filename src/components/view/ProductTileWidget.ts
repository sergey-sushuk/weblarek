import { CardView } from './CardView';
import type { Price } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export type TileProps = {
  id: string;
  title: string;
  image?: string;
  price: Price;
  category?: string;
  inBasket: boolean;
};

export type TileOpts = {
  onOpen: (id: string) => void;
};

export class ProductTileWidget extends CardView<TileProps> {
  private id!: string;

  constructor(props: TileProps, opts: TileOpts) {
    // В шаблонах стартера id именно '#card-catalog'
    const root = cloneTemplate<HTMLElement>('#card-catalog');
    super(root);

    this.titleEl = ensureElement('.card__title', root);
    this.priceEl = ensureElement('.card__price', root);
    this.categoryEl = ensureElement('.card__category', root);

    const img = root.querySelector('.card__image');
    if (img instanceof HTMLImageElement) this.imgEl = img;
    else this.imgBoxEl = img as HTMLElement | undefined;

    root.addEventListener('click', (e) => {
      e.preventDefault();
      opts.onOpen(this.id);
    });

    this.setState(props);
  }

  setState(p: TileProps) {
    this.id = p.id;
    this.setTitle(p.title);
    this.applyImage(p.image, p.title);
    this.setPrice(p.price);
    this.setCategory(p.category);
  }

  render(): HTMLElement {
    return this.container;
  }
}
