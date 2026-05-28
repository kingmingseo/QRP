import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import * as CryptoJS from 'crypto-js';

const SECRET = process.env.ENCRYPTION_SECRET_KEY;

const encryptedColumn = (options?: object): PropertyDecorator =>
  Column({
    ...options,
    transformer: {
      to: (value: string) => {
        if (!value) return value;
        return CryptoJS.AES.encrypt(value, SECRET).toString();
      },
      from: (value: string) => {
        if (!value) return value;
        const bytes = CryptoJS.AES.decrypt(value, SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
      },
    },
  });



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

  @encryptedColumn()
  name!: string

  @encryptedColumn()
  birthDate!: string

  @encryptedColumn({ default: "unknown" })
  gender!: string

  @encryptedColumn({ default: "unknown" })
  bloodType!: string

  @encryptedColumn({ nullable: true })
  illness?: string

  @encryptedColumn({ nullable: true })
  medications?: string

  @encryptedColumn({ nullable: true })
  allergies?: string

  @encryptedColumn()
  emergencyContact1!: string

  @encryptedColumn({ nullable: true })
  emergencyContact2?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}