import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <Link href="/">me</Link>
        <Link href="/a">a</Link>
        <Link href="/b">b</Link>
        <h2>I am next app with next link</h2>
      </main>
    </>
  )
}
