import { NextApiRequest, NextApiResponse } from 'next'
import { getPrismaClient } from '../../utils/getPrismaClient'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import microCors from 'micro-cors'


const cors = microCors({ allowMethods: ['GET', 'POST'] })

const routes = {
  async post(req: NextApiRequest, res: NextApiResponse, prisma: PrismaClient) {
    let { email, name, password } = req.body

    try {
      const user = await prisma.user.create({
        data: { 
          email,
          name, 
          password: await bcrypt.hash(password, 8)
          } 
        })

      return res.json({
        user: {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
        }
      })
    } catch {
      return res.status(400).json({ message: 'Houve um erro' })
    }
  },
  async get(req: NextApiRequest, res: NextApiResponse, prisma: PrismaClient) {
    // const session = await getSession({ req })
    // if (!session) {
    //   return res.status(401).json({ message: "Unauthorized" })
    // }
  
    const users = await prisma.user.findMany()
  
    return res.json(users)
  }
}

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  const prisma = getPrismaClient()

  const method = request.method.toLowerCase()

  if(!routes[method]) {
    return response.status(404).end()
  }

  return routes[method](request, response, prisma)
}

export default cors(handler)