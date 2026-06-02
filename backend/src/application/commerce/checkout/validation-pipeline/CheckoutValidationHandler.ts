import { CheckoutContext } from './CheckoutContext';

export abstract class CheckoutValidationHandler {
  private nextHandler?: CheckoutValidationHandler;

  public setNext(handler: CheckoutValidationHandler): CheckoutValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  public async handle(context: CheckoutContext): Promise<void> {
    await this.validate(context);
    if (this.nextHandler) {
      await this.nextHandler.handle(context);
    }
  }

  protected abstract validate(context: CheckoutContext): Promise<void>;
}
