// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//
// @Entity()
// export class Post {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column({ nullable: false })
//   title: string;
//
//   @Column({ nullable: false })
//   shortDescription: string;
//
//   @Column({ nullable: false })
//   content: string;
//
//   @Column({ nullable: false })
//   blogId: string;
//
//   @Column({ nullable: false })
//   blogName: string;
//
//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;
//
//   @Column({ default: 0 })
//   likesCount: number;
//
//   @Column({ default: 0 })
//   dislikesCount: number;
// }
export class Post {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
}
