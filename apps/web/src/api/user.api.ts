import type { CreateUserDto, EditUserDto, LoginDto, MedicalInfo as SharedMedicalInfo } from "@workspace/shared";
import { api } from "./axios";

export type MedicalInfo = SharedMedicalInfo


export type PublicMedicalInfo = Pick<
  SharedMedicalInfo,
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

export async function editMedicalInfoByQrCode(qrCode: string, editInfo: EditUserDto) {
  const response = await api.patch(`/users/medical-info/${qrCode}`, editInfo)

  return response.data
}
