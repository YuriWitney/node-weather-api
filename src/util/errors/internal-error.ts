export class internalError extends Error {
  constructor(
    public message: string,
    private code: number = 500,
    private description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
