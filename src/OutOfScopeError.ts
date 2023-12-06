export class OutOfScopeError extends Error {
  token: string;
  tokenScopes: string | Array<string>;
  requiredScopes: string | Array<string>;

  constructor(
    token: string,
    tokenScopes: string | Array<string>,
    requiredScopes: string | Array<string>
  ) {
    super('An out-of-scope token has been passed.');

    this.token = token;
    this.tokenScopes = tokenScopes;
    this.requiredScopes = requiredScopes;

    Error.captureStackTrace(this, this.constructor);
  }

  getToken() {
    return this.token;
  }
}
