import { NextApiRequest, NextApiResponse } from 'next'
import { getPrismaClient } from '../../../utils/getPrismaClient'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.APP_SECRET || 'secret'
const expiresIn = process.env.APP_EXPIRES || '7d'

export default async function(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not Allowed" })
  }

  let { email, password } = request.body

  const prisma = getPrismaClient()

  const user = await prisma.user.findOne({ where: { email } })

  if(!user) {
    return response.status(401).json({ message: "Email não cadastrado" })
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return response.status(401).json({ message: "Senha incorreta" })
  }

  return response.json({
    user: {
      avatar: user.avatar,
      email: user.email,
      name: user.name,
    },
    token: jwt.sign({ id: user.id }, secret, { expiresIn })
  })
}