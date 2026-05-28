// src/common/encryption/encryption.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly secretKey: string;

  // 2. 생성자를 통해 ConfigService 주입
  constructor(private readonly configService: ConfigService) {
    // 3. configService.get()으로 환경변수 로드
    this.secretKey = this.configService.get<string>('ENCRYPTION_SECRET_KEY')!;
  }

  encrypt(plainText: string): string {
    if (!plainText) return plainText;
    return CryptoJS.AES.encrypt(plainText, this.secretKey).toString();
  }

  decrypt(cipherText: string): string {
    if (!cipherText) return cipherText;
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}