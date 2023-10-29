import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, Relation} from "typeorm"
import {Card} from "./Card.js";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    password: string

    @Column({unique: true})
    email: string

    @OneToOne(() => Card, card => card.id, {
        cascade: true
    })
    @JoinColumn()
    card: number

}
