import { CardView } from './CardView';
import type { Price } from '../../types';
import { cloneTpl } from './dom';

export type TileProps = {
  id: string;
  title: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
};

export class ProductTileWidget extends CardView<TileProps> {
  constructor(private props: TileProps, private onOpen: (id: string) => void) {
    const root = cloneTpl<HTMLElement>('card-catalog');
    super(root);

    this.titleEl = root.querySelector('.card__title') as HTMLElement;
    const imgNode = root.querySelector('.card__image') as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;
    this.priceEl = root.querySelector('.card__price') as HTMLElement;
    this.categoryEl = root.querySelector('.card__category') as HTMLElement;

    root.addEventListener('click', () => this.onOpen(this.props.id));

    this.apply();
  }

  private apply() {
    this.setTitle(this.props.title);
    this.applyImage(this.props.image, this.props.title);
    this.setPrice(this.props.price);
    this.setCategory(this.props.category);
  }

  render(): HTMLElement {
    return this.container;
  }
}
