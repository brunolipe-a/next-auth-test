import React, { useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'

export default function Page() {
  const [ session, loading ] = useSession()

  const handleSignIn = useCallback(() => {
    signIn('basic-auth', { name: "Bruno", email: "bfaa1999@gmail.com", password: "123456", json: true })
  }, [])

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>}
  </>
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query: query.error || null
    }
  }
}