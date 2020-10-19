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
      id: "basic-auth",
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@example" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as unknown as Credentials

        try {
          const user = await prisma.user.findFirst({
            where: {
              email
            }
          })

          if (user?.password === password) {
            return Promise.resolve(user)
          } else {
            return Promise.reject(new Error('Email ou senha incorretos, verifique e tente novamente'))
          }
        } catch(e) {
          return Promise.reject(new Error('Invalid request'))
        }
      }
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  session: {
    jwt: true,
  },
  pages: {
    error: '/'
  },
  jwt: {
    secret: process.env.APP_SECRET,
    encryption: true
  },
  adapter: Adapters.Prisma.Adapter({ prisma })
}

export default (req: NowRequest, res: NowResponse) => NextAuth(req, res, options)
