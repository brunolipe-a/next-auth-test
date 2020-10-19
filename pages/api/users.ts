import { NowRequest, NowResponse } from '@vercel/node'
import { getPrismaClient } from '../../utils/getPrismaClient'

export default async function(request: NowRequest, response: NowResponse) {
  const prisma = getPrismaClient()

  const users = await prisma.user.findMany()

  return response.json(users)
}