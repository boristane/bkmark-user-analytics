import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Collection } from "./Collection";
import { Tag } from "./Tag";

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  uuid!: number;

  @Column()
  url!: string;

  @ManyToOne(() => Collection, collection => collection.bookmarks, {
    cascade: true
  })
  collection!: Collection;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags?: Tag[];

  @Column()
  expiration!: Date;

  @Column()
  archived!: boolean;

  @Column()
  favourite!: boolean;

  @Column()
  countOpen!: number;

  @Column()
  type!: string;

  @Column()
  origin?: string;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;
}
