// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { User } from '../../user/entities/user.entity';
//
// @Entity('sessions')
// export class Session {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;
//
//   @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'userId' })
//   user: User;
//
//   @Column({ type: 'uuid', nullable: false })
//   userId: string;
//
//   @Column({ type: 'uuid', nullable: false })
//   deviceId: string;
//
//   @Column({ type: 'varchar', length: 255, nullable: false })
//   ip: string;
//
//   @Column({ type: 'varchar', length: 255, nullable: false })
//   title: string;
//
//   @Column({ type: 'timestamp', nullable: false })
//   iatDate: Date;
//
//   @Column({ type: 'timestamp', nullable: false })
//   expDate: Date;
// }
export class Session {
  id: string; // UUID for the session ID
  userId: string; // UUID for the user
  deviceId: string; // UUID for the device
  ip: string; // IP address of the device
  title: string; // Device/browser name or session title
  iatDate: Date; // Issued At date (when the session was created)
  expDate: Date; // Expiration date of the session
}
