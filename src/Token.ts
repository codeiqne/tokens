// eslint-disable-next-line node/no-unpublished-import
import {DataSource, Repository} from 'typeorm';
import {Token as TokenModel} from './TokenModel';
import {v4 as uuidv4} from 'uuid';
import {InvalidTokenError} from './InvalidTokenError';
import {ExpiredTokenError} from './ExpiredTokenError';
import {OutOfScopeError} from './OutOfScopeError';
import {
  sign as jwtSign,
  TokenExpiredError,
  verify as jwtVerify,
} from 'jsonwebtoken';

export class ScopedToken {
  private repo: Repository<TokenModel>;
  private readonly id: string;
  private readonly token: string;
  private readonly data: Object;
  private readonly scopes: Array<string>;
  private readonly expiration: Date;
  private readonly comment: string;
  // @ts-ignore
  private obj: TokenModel;

  private constructor(
    repo: Repository<TokenModel>,
    token: string | undefined,
    data: Object,
    scopes: Array<string>,
    expiration: Date,
    comment: string,
    id: string,
    obj: TokenModel
  ) {
    this.repo = repo;
    // @ts-ignore
    this.token = token;
    this.data = data;
    this.scopes = scopes;
    this.expiration = expiration;
    this.comment = comment;
    this.id = id;
    this.obj = obj;
  }

  getToken(): string {
    return this.token;
  }

  getData(): Object {
    return this.data;
  }

  getScopes(): Array<string> {
    return this.scopes;
  }

  getExpiration(): Date {
    return this.expiration;
  }

  getComment(): string {
    return this.comment;
  }

  hasScope(scope: string | Array<string>): boolean {
    if (typeof scope === 'string') {
      return scope in this.getScopes();
    } else {
      return scope.every(s => this.getScopes().includes(s));
    }
  }

  async revoke(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.repo
        .remove(this.obj)
        .catch(e => reject(e))
        .then(() => resolve(true));
    });
  }

  /*-----------------------------------------------------------------*/

  static async create(
    dataSource: DataSource,
    data: Object,
    scopes: Array<string>,
    expiration: Date,
    comment: string,
    privateKey: string
  ) {
    const id = uuidv4();
    const payload = {
      exp: expiration.getTime() / 1000,
      comment: comment,
    };
    const token = jwtSign(payload, privateKey, {
      jwtid: id,
    });

    const obj = new TokenModel();
    obj.id = id;
    obj.token = token;
    obj.data = JSON.stringify(data);
    obj.scopes = scopes.join(';;');
    obj.expiration = expiration.toString();
    obj.comment = comment;

    const repo = dataSource.getRepository(TokenModel);
    await repo.save(obj);

    return new ScopedToken(
      repo,
      token,
      data,
      scopes,
      expiration,
      comment,
      id,
      obj
    );
  }

  static async find(
    repo: Repository<TokenModel>,
    token: string,
    privateKey: string
  ) {
    try {
      jwtVerify(token, privateKey);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ExpiredTokenError(token, e.expiredAt);
      } else {
        throw new InvalidTokenError(token);
      }
    }

    const result = await repo.findOneBy({
      token: token,
    });

    if (!result) {
      throw new InvalidTokenError(token);
    }
    if (Date.now() > Date.parse(result.expiration)) {
      throw new ExpiredTokenError(token, new Date(result.expiration));
    }

    return new ScopedToken(
      repo,
      token,
      JSON.parse(result.data),
      result.scopes.split(';;'),
      new Date(result.expiration),
      result.comment,
      result.id,
      result
    );
  }

  static async guard(
    repo: Repository<TokenModel>,
    token: string,
    scopes: string | Array<string>,
    privateKey: string
  ) {
    try {
      const obj = await ScopedToken.find(repo, token, privateKey);
      if (!obj.hasScope(scopes)) {
        throw new OutOfScopeError(token, obj.getScopes(), scopes);
      }
      return obj;
    } catch (e) {
      if (e instanceof OutOfScopeError) {
        throw e;
      }
      throw new InvalidTokenError(token);
    }
  }
}
