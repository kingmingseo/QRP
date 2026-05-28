import type { CreateUserDto, LoginDto } from "@workspace/shared";
import { api } from "./axios";

export async function createUser(userInfo: CreateUserDto) {
  const response = api.post('/users', userInfo)

  return response
}

export async function login(loginInfo: LoginDto) {
  const response = api.post('/auth/login', loginInfo)
  return response
}