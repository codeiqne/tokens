import {ScopedToken} from './Token';
import {Token as TokenModel} from './TokenModel';
import {InvalidTokenError} from './InvalidTokenError';
import {ExpiredTokenError} from './ExpiredTokenError';
import {OutOfScopeError} from './OutOfScopeError';

import {DataSource} from 'typeorm';

interface Options {
  privateKey: string;
  //  table?: string;
}

class Tokens {
  dataSource: DataSource;
  options: Options;

  constructor(dataSource: DataSource, options: Options) {
    this.dataSource = dataSource;
    this.options = options;
  }

  async createScopedToken(
    data: Object,
    scopes: Array<string> = [],
    expiration: Date | undefined = undefined,
    comment = ''
  ) {
    if (expiration === undefined) {
      expiration = new Date();
      expiration.setDate(expiration.getDate() + 30);
    }

    return await ScopedToken.create(
      this.dataSource,
      data,
      scopes,
      expiration,
      comment,
      this.options.privateKey
    );
  }

  async guard(token: string, scopes: string | Array<string>) {
    return await ScopedToken.guard(
      this.dataSource.getRepository(TokenModel),
      token,
      scopes,
      this.options.privateKey
    );
  }
}

export default {
  Tokens,
  ScopedToken,
  InvalidTokenError,
  ExpiredTokenError,
  OutOfScopeError,
};
