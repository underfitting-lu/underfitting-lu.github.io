import NextLink from 'next/link'
import {Heading,Link} from '@chakra-ui/react'
export default function NotFound(){return <><Heading as="h1" mb={3}>Page not found</Heading><Link as={NextLink} href="/">Back home →</Link></>}
