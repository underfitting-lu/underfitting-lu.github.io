import { extendTheme } from '@chakra-ui/react'

const styles = {
  global: props => ({
    body: {
      bg: props.colorMode === 'dark' ? '#202023' : '#f0e7db',
      color: props.colorMode === 'dark' ? '#efebe5' : '#30332f',
      fontSize: '16px',
      lineHeight: 1.8
    }
  })
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      }
    }
  },
  Link: {
    baseStyle: props => ({
      color: props.colorMode === 'dark' ? '#88ccca' : '#23645c',
      textUnderlineOffset: 3
    })
  }
}

const fonts = {
  heading: "'M PLUS Rounded 1c', 'Trebuchet MS', sans-serif",
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
}

const colors = {
  grassTeal: '#88ccca'
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme
