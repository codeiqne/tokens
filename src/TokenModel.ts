import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryColumn()
  id: string;

  @Column()
  token: string;

  @Column()
  data: string;

  @Column()
  scopes: string;

  @Column()
  comment: string;

  @Column()
  expiration: string;

  @Column('bool', {default: true})
  enabled: boolean;
}
