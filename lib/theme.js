import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
  fonts: {
    heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  colors: { grassTeal: '#dae7ff' },
  styles: {
    global: props => ({
      body: {
        bg: props.colorMode === 'dark' ? '#111214' : '#fbfaf9',
        color: props.colorMode === 'dark' ? '#eceef2' : '#202124',
        fontSize: '16px', lineHeight: 1.75
      }
    })
  },
  components: {
    Heading: {
      baseStyle: { fontWeight: 600, letterSpacing: '-.045em' },
      variants: {
        'section-title': { fontSize: 26, letterSpacing: '-.045em', marginBottom: 6, lineHeight: 1.25 }
      }
    },
    Link: {
      baseStyle: props => ({ color: props.colorMode === 'dark' ? '#92b5ff' : '#315edb', textUnderlineOffset: 4 })
    },
    Button: { baseStyle: { fontWeight: 500, borderRadius: 'full' } },
    Menu: { baseStyle: { list: { borderRadius: 18, padding: 2 }, item: { borderRadius: 10 } } }
  }
})
export default theme
