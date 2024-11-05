import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: null })
  passwordRecoveryCode: string;

  @Column({ default: null })
  recoveryCodeExpirationDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
