import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class User {
  @PrimaryColumn()
  uuid!: string;

  @OneToMany(() => Collection, collection => collection.user)
  collections?: Collection[];

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;
}