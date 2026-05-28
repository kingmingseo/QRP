import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@workspace/shared/schemas/registration';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  
  async checkDuplicateId(userId: string): Promise<boolean> {
    const exists = await this.userRepository.existsBy({ userId })
    return exists
  }

  async createUser(userInfo: CreateUserDto): Promise<User> {
    const exists = await this.checkDuplicateId(userInfo.userId!)

    if (exists) {
      throw new ConflictException('이미 사용 중인 아이디입니다.')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(userInfo.password, saltRounds)

    try {
      const user = this.userRepository.create({
        ...userInfo,
        password: hashedPassword
      })
      return await this.userRepository.save(user)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('회원가입 처리 중 오류가 발생했습니다.')
    }
  }

  async findByUserId(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { userId },
    })
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    })
  }

}
