import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from '@workspace/shared/schemas/registration';
import * as bcrypt from 'bcrypt'

export type PublicMedicalInfo = Pick<
  User,
  | 'name'
  | 'birthDate'
  | 'gender'
  | 'bloodType'
  | 'illness'
  | 'medications'
  | 'allergies'
  | 'emergencyContact1'
  | 'emergencyContact2'
>

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

  async checkQrCodeExists(qrCode: string): Promise<boolean> {
    return this.userRepository.existsBy({ qrCode })
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


  async findPublicMedicalInfoByQrCode(qrCode: string): Promise<PublicMedicalInfo> {
    const user = await this.userRepository.findOne({
      where: { qrCode },
    })

    if (!user) {
      throw new NotFoundException('등록된 의료 정보를 찾을 수 없습니다.')
    }

    return {
      name: user.name,
      birthDate: user.birthDate,
      gender: user.gender,
      bloodType: user.bloodType,
      illness: user.illness,
      medications: user.medications,
      allergies: user.allergies,
      emergencyContact1: user.emergencyContact1,
      emergencyContact2: user.emergencyContact2,
    }
  }

  async editMedicalInfoByQrCode(qrCode: string, medicalInfo: EditUserDto) {
    const user = await this.userRepository.findOne({
      where: { qrCode },
    })

    if (!user) {
      throw new NotFoundException('등록된 의료 정보를 찾을 수 없습니다.')
    }

    await this.userRepository.save({
      ...user,
      ...medicalInfo,
    })

    return {
      success: true,
      message: '의료 정보가 수정되었습니다.',
    }

  }
}
