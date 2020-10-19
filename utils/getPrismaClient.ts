
import { PrismaClient } from '@prisma/client'

let cachedPrisma: PrismaClient = null 

export const getPrismaClient = () => {
  if (cachedPrisma) {
    console.log('cached')
    return cachedPrisma
  }

  console.log('not cached')

  const prisma = new PrismaClient()

  cachedPrisma = prisma

  return prisma
}