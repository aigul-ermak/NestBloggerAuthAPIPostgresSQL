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
  id: string;
  userId: number;
  deviceId: string;
  ip: string;
  title: string;
  iatDate: Date;
  expDate: Date;
}
