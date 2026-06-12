import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { store } from './store'
import { GlobalStyle } from './styles/global'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil/:id" element={<Profile />} />
        </Routes>
        <Footer />
        <CartDrawer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
