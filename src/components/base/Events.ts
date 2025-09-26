// Лёгкий брокер событий без излишней типизации,
// чтобы исключить конфликт вида: "IBuyer нельзя назначить 'buyer:changed'".
export type EventName = string | RegExp | '*';

export interface IEvents {
  on<T = any>(eventName: EventName, callback: (data: T) => void): void;
  off(eventName: EventName, callback: (data: any) => void): void;
  emit<T = any>(eventName: string, data?: T): void;
}

export class Events implements IEvents {
  private listeners = new Map<EventName, Set<Function>>();

  on<T = any>(eventName: EventName, callback: (data: T) => void): void {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
    this.listeners.get(eventName)!.add(callback);
  }

  off(eventName: EventName, callback: (data: any) => void): void {
    this.listeners.get(eventName)?.delete(callback);
  }

  emit<T = any>(eventName: string, data?: T): void {
    // точное совпадение
    this.listeners.get(eventName)?.forEach((cb) => cb(data));
    // по RegExp
    [...this.listeners.keys()]
      .filter((k) => k instanceof RegExp && (k as RegExp).test(eventName))
      .forEach((k) => this.listeners.get(k)!.forEach((cb) => cb(data)));
    // слушатели на все события
    this.listeners.get('*')?.forEach((cb) => cb({ eventName, data }));
  }
}
