import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation } from 'typeorm';
import { User } from './User.js';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNumber: number;

  @Column()
  CVV: number;

  @Column()
  balance: number;

  @OneToOne(() => User, (user) => user.card)
  user: Relation<User>;
}
