export function isSelector(x: any): x is string {
  return typeof x === 'string' && x.length > 1;
}

export function ensureAllElements<T extends HTMLElement>(
  selectorElement: string | NodeListOf<Element> | T[],
  context: HTMLElement = document as unknown as HTMLElement
): T[] {
  if (isSelector(selectorElement)) {
    return Array.from(context.querySelectorAll(selectorElement)) as T[];
  }
  if (selectorElement instanceof NodeList) {
    return Array.from(selectorElement) as T[];
  }
  if (Array.isArray(selectorElement)) {
    return selectorElement as T[];
  }
  throw new Error('Unknown selector element');
}

export function ensureElement<T extends HTMLElement>(
  selectorElement: T | string,
  context?: HTMLElement
): T {
  if (isSelector(selectorElement)) {
    const elements = ensureAllElements<T>(selectorElement, context);
    if (elements.length === 0) throw new Error(`selector ${selectorElement} returned nothing`);
    if (elements.length > 1) console.warn(`selector ${selectorElement} returned more than one element`);
    return elements[0];
  }
  if (selectorElement instanceof HTMLElement) return selectorElement as T;
  throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
  const template = ensureElement<HTMLTemplateElement>(query as any);
  return template.content.firstElementChild!.cloneNode(true) as T;
}
