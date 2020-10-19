import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NowRequest, NowResponse } from '@vercel/node'
import Adapters from 'next-auth/adapters'
import { getPrismaClient } from '../../../utils/getPrismaClient'

const prisma = getPrismaClient()

interface Credentials {
  email: string
  name: string
  password: string
}

const options: InitOptions = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text", placeholder: "johndoe@example" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, name, password } = credentials as unknown as Credentials

        try {
          const user = await prisma.user.create({
            data: {
              email: email,
              name: name,
              password: password
            }
          })
          return Promise.resolve(user)
        } catch(e) {
          return Promise.resolve(false)
        }
      }
    })
  ],
  session: {
    jwt: true,
  },
  jwt: {
      secret: process.env.APP_SECRET,
      encryption: true
  },
  pages: {
    error: '/error'
  },
  adapter: Adapters.Prisma.Adapter({ prisma })
}

export default (req: NowRequest, res: NowResponse) => NextAuth(req, res, options)
