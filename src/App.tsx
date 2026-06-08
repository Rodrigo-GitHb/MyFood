import { Provider } from 'react-redux'
import { store } from './store'
import { GlobalStyle } from './styles/global'
import { Header } from './components/Header'
import { DishCard } from './components/DishCard'
import { Checkout } from './components/Checkout'
import styled from 'styled-components'
import { Dish } from './types'

const dishes: Dish[] = [
  {
    id: 101,
    name: 'Pizza Margherita',
    restaurant: 'La Dolce Vita',
    category: 'Italiana',
    description: 'Massa artesanal, molho de tomates frescos, mozzarella e manjericao.',
    portion: 'Serve 2 pessoas',
    price: 69.9,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 102,
    name: 'Sushi Especial',
    restaurant: 'Sakura House',
    category: 'Japonesa',
    description: 'Combinado com sashimis, niguiris e rolls crocantes preparados na hora.',
    portion: '20 pecas',
    price: 92,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 103,
    name: 'Ravioli ao Sugo',
    restaurant: 'Nonna Rosa',
    category: 'Massas',
    description: 'Ravioli recheado com queijo, finalizado com molho sugo e parmesao.',
    portion: 'Serve 1 pessoa',
    price: 54.5,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 104,
    name: 'Burger da Casa',
    restaurant: 'Urban Grill',
    category: 'Lanches',
    description: 'Blend bovino, cheddar, cebola caramelizada e maionese defumada.',
    portion: 'Acompanha fritas',
    price: 47.9,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80'
  }
]

const MainContainer = styled.main`
  padding: 80px 0;
  
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Header />
      <MainContainer className="container">
        <div className="grid">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </MainContainer>
      <Checkout />
    </Provider>
  )
}

export default App
