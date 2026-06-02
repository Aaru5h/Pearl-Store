import { singleton } from 'tsyringe';
import { EventBus, EventHandler } from '../../domain/shared/events/EventBus';
import { DomainEvent } from '../../domain/shared/events/DomainEvent';

@singleton()
export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  public async publish(events: DomainEvent | DomainEvent[]): Promise<void> {
    const eventList = Array.isArray(events) ? events : [events];

    for (const event of eventList) {
      const eventName = event.eventName;
      const eventHandlers = this.handlers.get(eventName);

      if (eventHandlers && eventHandlers.size > 0) {
        // Run all handlers concurrently, catching errors so they don't block other handlers
        const handlerPromises = Array.from(eventHandlers).map(async (handler) => {
          try {
            await handler(event);
          } catch (error) {
            console.error(`[InMemoryEventBus] Error in handler for event ${eventName}:`, error);
          }
        });

        await Promise.all(handlerPromises);
      }
    }
  }

  public subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);
  }

  public unsubscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(eventName);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }
}
