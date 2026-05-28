import type { CreateUserDto } from "@workspace/shared";
import { api } from "./axios";

export async function createUser(userInfo: CreateUserDto) {
  const response = api.post('/users',userInfo)
  
  return response
}