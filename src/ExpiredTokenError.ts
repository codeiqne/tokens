export class ExpiredTokenError extends Error {
  token: string;
  expiredAt: Date;

  constructor(token: string, expiredAt: Date) {
    super('An expired token has been passed.');

    this.token = token;
    this.expiredAt = expiredAt;

    Error.captureStackTrace(this, this.constructor);
  }

  getToken() {
    return this.token;
  }
}
