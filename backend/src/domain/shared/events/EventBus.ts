import { DomainEvent } from './DomainEvent';

export type EventHandler<T extends DomainEvent = any> = (event: T) => Promise<void> | void;

export interface EventBus {
  publish(events: DomainEvent | DomainEvent[]): Promise<void>;
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void;
  unsubscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void;
}
