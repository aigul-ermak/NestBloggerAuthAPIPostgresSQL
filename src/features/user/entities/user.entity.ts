// import { Session } from '../../session/entities/session.entity';
//
// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   login: string;
//
//   @Column()
//   email: string;
//
//   @Column()
//   passwordHash: string;
//
//   @Column({ default: null })
//   passwordRecoveryCode: string;
//
//   @Column({ default: null })
//   recoveryCodeExpirationDate: Date;
//
//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;
//
//   @Column({ default: null })
//   confirmationCode: string;
//
//   @Column({ default: null })
//   expirationDate: Date;
//
//   @Column({ default: false })
//   isConfirmed: boolean;
//
//   @OneToMany(() => Session, (session) => session.user)
//   sessions: Session[];
// }
export class User {
  id: number;
  login: string;
  email: string;
  passwordHash: string;
  passwordRecoveryCode?: string;
  recoveryCodeExpirationDate?: Date;
  createdAt: Date;
  confirmationCode?: string;
  expirationDate?: Date;
  isConfirmed: boolean;
}
