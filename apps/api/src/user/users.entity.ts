import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import * as CryptoJS from 'crypto-js';

const encryptedColumn = (options?: object): PropertyDecorator =>
  Column({
    ...options,
    transformer: {
      to: (value: string) => {
        if (!value) return value;

        // 런타임에 직접 환경변수를 가져옵니다.
        const secret = process.env.ENCRYPTION_SECRET_KEY;
        if (!secret) {
          throw new Error('데이터베이스 암호화 키(ENCRYPTION_SECRET_KEY)가 설정되지 않았습니다.');
        }

        return CryptoJS.AES.encrypt(value, secret).toString();
      },
      from: (value: string) => {
        if (!value) return value;

        // 런타임에 직접 환경변수를 가져옵니다.
        const secret = process.env.ENCRYPTION_SECRET_KEY;
        if (!secret) {
          throw new Error('데이터베이스 복호화 키(ENCRYPTION_SECRET_KEY)가 설정되지 않았습니다.');
        }

        const bytes = CryptoJS.AES.decrypt(value, secret);
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