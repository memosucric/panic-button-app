import { UserProvider } from '@auth0/nextjs-auth0/client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import Layout from 'src/components/Layout/Layout'
import { TITLE } from 'src/config/constants'
import createEmotionCache from 'src/config/createEmotionCache'
import theme from 'src/config/theme'
import CssBaseline from '@mui/material/CssBaseline'
import NoSsr from '@mui/material/NoSsr'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import * as React from 'react'
import { AppProvider } from 'src/contexts/app.context'
import Loading from 'src/components/Loading'
import { HEADER_HEIGHT } from 'src/components/Layout/Header'
import { FOOTER_HEIGHT } from 'src/components/Layout/Footer'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const start = () => {
      console.log('start')
      setIsLoading(true)
    }
    const end = () => {
      console.log('finished')
      setIsLoading(false)
    }
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)
    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', end)
      Router.events.off('routeChangeError', end)
    }
  }, [])

  return (
    <UserProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>{TITLE}</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <AppProvider>
            <NoSsr>
              <CssBaseline />
              <Layout>
                {isLoading ? (
                  <Loading minHeight={`calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`} />
                ) : (
                  <Component {...pageProps} />
                )}
              </Layout>
            </NoSsr>
          </AppProvider>
        </ThemeProvider>
      </CacheProvider>
    </UserProvider>
  )
}
