import Head from 'next/head'
import { Provider } from 'react-redux'
import { MediaContextProvider, Media  } from '../src/handlers/breakpoint'
import LayoutSmall from '../src/components/LayoutSmall'
import LayoutWide from '../src/components/LayoutWide'
import store from '../src/stores/store'
import '../src/styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <MediaContextProvider>
        <Head>
          <title>Platform Task</title>
          <meta name="description" content="Platform engineer task" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Media at="sm">
          <LayoutSmall>
            <Component {...pageProps} />
          </LayoutSmall>
        </Media>
        <Media greaterThan="sm">
          <LayoutWide>
          <Component {...pageProps} />
          </LayoutWide>
        </Media>
      </MediaContextProvider>
    </Provider>
  )
}

export default App
