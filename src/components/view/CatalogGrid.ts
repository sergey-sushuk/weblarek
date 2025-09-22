
import { Component } from '../base/Component';
import { ProductTileWidget, type TileProps } from './ProductTileWidget';

type CatalogState = { items: TileProps[] };

export class CatalogGrid extends Component<CatalogState> {
  private grid: HTMLElement;
  private state: CatalogState = { items: [] };

  constructor(private onOpen: (id: string) => void) {
    const grid = document.querySelector<HTMLElement>('.gallery');
    if (!grid) throw new Error('CatalogGridWidget: .gallery not found');
    super(grid);
    this.grid = grid;
  }

  setState(state: CatalogState) {
    this.state = state;
    this.render(); // можно оставить, тип теперь корректный
  }

  override render(data?: Partial<CatalogState>): HTMLElement {
    if (data) this.state = { ...this.state, ...data };

    const nodes = this.state.items.map((props) => {
      const tile = new ProductTileWidget(props, this.onOpen);
      return tile.render();
    });

    this.grid.replaceChildren(...nodes);
    // super(grid) обычно сохраняет контейнер в this.container — вернём его
    return (this as any).container ?? this.grid;
  }
}
