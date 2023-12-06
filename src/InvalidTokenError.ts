export class InvalidTokenError extends Error {
  token: string;

  constructor(token: string) {
    super('An invalid token has been passed.');

    this.token = token;

    Error.captureStackTrace(this, this.constructor);
  }

  getToken() {
    return this.token;
  }
}
