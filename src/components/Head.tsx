import NextHead from 'next/head'

const Head = () => (
    <NextHead>
        <meta charSet="utf-8" />
        <link rel="icon" href="/p-static/images/favicons/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
            name="description"
            content="Antoine Kingue: developer, designer and youtuber"
        />
        <link rel="apple-touch-icon" href="/p-static/images/favicons/favicon.png" />
        <link rel="canonical" href="https://antoinek.fr/" />
        <link rel="manifest" href="/manifest.json" />

        <link href="https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;700&amp;display=swap" rel="stylesheet" />

        <title>Antoine Kingue</title>
    </NextHead>
)

export default Head