import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Bookmark } from "./Bookmark";
import { User } from "./User";

@Entity()
export class Collection {
  @PrimaryColumn()
  uuid!: string;

  @ManyToOne(() => User, user => user.collections)
  user!: User;

  @OneToMany(() => Bookmark, bookmark => bookmark.collection)
  bookmarks?: Bookmark[];

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;
}
