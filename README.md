# @tspacejs/tokens

> simple package for scoped API tokens
---

## install

using npm:

```bash
$ npm i --save @tspacejs/tokens
```

or using yarn:

```bash
$ yarn add @tspacejs/tokens
```

## usage

```ts
import tokens as t from '@tspacejs/tokens';
const tokens = t.Tokens(<typeorm datasource >, {privateKey: 'shhhh'});

const expiration = new Date();
expiration.setDate(expiration.getDate() + 90); // 90 days
const token = tokens.createScopedToken({accountId: 123}, ['posts:write'], expiration, "this is an API token");
// -----------------------------------
await tokens.guard("<token>", ["posts:write"]);
// -----------------------------------
await token.revoke();
```

better docs coming soon
  
