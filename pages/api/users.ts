import { NextApiRequest, NextApiResponse } from 'next'
import { getPrismaClient } from '../../utils/getPrismaClient'
import { getSession } from 'next-auth/client'

export default async function(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request })
  if (!session) {
    return response.status(401).json({ message: "Unauthorized" })
  }

  const prisma = getPrismaClient()

  const users = await prisma.user.findMany()

  return response.json(users)
}