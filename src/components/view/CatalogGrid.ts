import { Component } from '../base/Component';

export class CatalogGrid extends Component<unknown> {
  private grid: HTMLElement;

  constructor(root: HTMLElement) {
    super(root);
    this.grid = root;
  }

 
  setChildren(nodes: HTMLElement[]) {
    this.grid.replaceChildren(...nodes);
  }
}
