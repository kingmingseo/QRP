import type { CreateUserDto, LoginDto } from "@workspace/shared";
import { api } from "./axios";

export type MedicalInfo = {
  id: number
  userId: string
  qrCode: string
  name: string
  birthDate: string
  gender: string
  bloodType: string
  illness?: string | null
  medications?: string | null
  allergies?: string | null
  emergencyContact1: string
  emergencyContact2?: string | null
  createdAt: string
  updatedAt: string
}

export type PublicMedicalInfo = Pick<
  MedicalInfo,
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

export async function createUser(userInfo: CreateUserDto) {
  const response = api.post('/users', userInfo)

  return response
}

export async function login(loginInfo: LoginDto) {
  const response = api.post('/auth/login', loginInfo)
  return response
}

export async function logout() {
  const response = await api.post('/auth/logout')

  return response.data
}

export async function getMyMedicalInfo() {
  const response = await api.get<MedicalInfo>('/auth/me')

  return response.data
}

export async function getMedicalInfoByQrCode(qrCode: string) {
  const response = await api.get<PublicMedicalInfo>(`/users/medical-info/${qrCode}`)

  return response.data
}
