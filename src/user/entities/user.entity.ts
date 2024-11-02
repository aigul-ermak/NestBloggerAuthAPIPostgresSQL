import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @OneToMany(() => Post, (p) => p.user)
  post: Post[];

  @Column()
  email: string;

  @Column()
  passwordHash: string;
  password: string;

  @Column()
  passwordRecoveryCode: string;

  @Column({ default: null })
  recoveryCodeExpirationDate: Date;

  @Column()
  createdAt: Date;
}
