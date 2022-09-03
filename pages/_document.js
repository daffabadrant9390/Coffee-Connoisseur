import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Link to Font by each Font-weight */}
          <link
            rel="preload"
            as="font" // only use this when the rel value is preload
            href="/fonts/IBMPlexSans-Bold.ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font" // only use this when the rel value is preload
            href="/fonts/IBMPlexSans-Regular.ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font" // only use this when the rel value is preload
            href="/fonts/IBMPlexSans-SemiBold.ttf"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
