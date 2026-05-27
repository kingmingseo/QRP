import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("users")
export class User {


  @PrimaryGeneratedColumn()
  userId!: string

  @Column()
  password!: string

  @Column()
  name!: string

  @Column()
  birthDate!: string

  @Column({ default: "unknown" })
  gender!: string

  @Column({ default: "unknown" })
  bloodType!: string

  @Column({ nullable: true })
  illness?: string

  @Column({ nullable: true })
  medications?: string

  @Column({ nullable: true })
  allergies?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}