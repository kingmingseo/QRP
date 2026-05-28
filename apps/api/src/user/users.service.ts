import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import type { CreateUserDto } from '@workspace/shared/schemas/registration';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const PASSWORD_SALT_LENGTH = 16;
const PASSWORD_KEY_LENGTH = 64;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_LENGTH).toString('hex');
  const derivedKey = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async checkDuplicateId(userId: string): Promise<boolean> {
    const exists = await this.userRepository.existsBy({ userId })
    return exists
  }

  async createUser(userInfo : CreateUserDto): Promise<User> {
    const exists = await this.checkDuplicateId(userInfo.userId!)

    if (exists) {
      throw new ConflictException('이미 사용 중인 아이디입니다.')
    }

    try {
      const hashedPassword = await hashPassword(userInfo.password)
      const user = this.userRepository.create({
        ...userInfo,
        password: hashedPassword,
      })
      return await this.userRepository.save(user)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.')
    }
  }

}
