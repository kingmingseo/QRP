import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  userId!: string

  @Column({ unique: true })
  qrCode!: string

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

  @Column()
  emergencyContact1!: string

  @Column({ nullable: true })
  emergencyContact2?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
