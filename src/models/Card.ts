import {Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn} from "typeorm"
import {User} from "./User.js";

@Entity()
export class Card {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    balance: number

    @OneToOne(() => User, user => user.id)
    @JoinColumn()
    user: number
}