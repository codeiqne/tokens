import {Entity, Column, PrimaryColumn} from 'typeorm';

// @ts-ignore
@Entity('tokens')
export class Token {
  // @ts-ignore
  @PrimaryColumn()
  // @ts-ignore
  id: string;

  // @ts-ignore
  @Column()
  // @ts-ignore
  token: string;

  // @ts-ignore
  @Column()
  // @ts-ignore
  data: string;

  // @ts-ignore
  @Column()
  // @ts-ignore
  scopes: string;

  // @ts-ignore
  @Column()
  // @ts-ignore
  comment: string;

  // @ts-ignore
  @Column()
  // @ts-ignore
  expiration: string;

  // @ts-ignore
  @Column('bool', {default: true})
  // @ts-ignore
  enabled: boolean;
}
