import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {User} from "../../user/entities/user.entity";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    shortDescription: string;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    blogId: string;

    @Column({ nullable: false })
    blogName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: 0 })
    likesCount: number;

    @Column({ default: 0 })
    dislikesCount: number;

    @ManyToOne(() => User, (user) => user.post, { eager: true })
    user: User;
}
