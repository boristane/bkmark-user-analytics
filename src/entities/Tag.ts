import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

export enum TagType {
  userDefined = "USER_DEFINED",
  auto = "AUTO",
}

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: TagType,
    default: TagType.userDefined
  })
  type!: TagType;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;
}
