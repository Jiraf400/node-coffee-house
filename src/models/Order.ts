import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToMany, JoinTable } from 'typeorm';
import { Card } from './Card.js';
import { MenuItem } from './Menu-Item.js';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => MenuItem, (item) => item.id)
  @JoinTable()
  menu_items: Relation<MenuItem[]>;

  @Column()
  status: string;

  @ManyToMany(() => Card, (card) => card.id)
  @JoinTable()
  cards: Relation<Card[]>;
}
