import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return <Html lang="en"><Head><link rel="stylesheet" href="/fonts/mplus-rounded.css" /></Head>
    <body><ColorModeScript initialColorMode="light" /><Main /><NextScript /></body></Html>
}
