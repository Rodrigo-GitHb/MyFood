import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');

  :root {
    --primary: #e66767;
    --light: #ffebd9;
    --background: #fff8f2;
    --white: #ffffff;
    --dark: #2f2f2f;
  }

  * {
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--background);
    color: var(--primary);
  }

  button,
  a {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  .container {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 1080px) {
    .container {
      max-width: calc(100% - 48px);
    }
  }

  @media (max-width: 640px) {
    .container {
      max-width: calc(100% - 32px);
    }
  }
`
