import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { MenuItemCard } from '../components/MenuItemCard'
import { ProductModal } from '../components/ProductModal'
import { getRestaurants } from '../services/api'
import { MenuItem, Restaurant } from '../types'

const Hero = styled.section<{ $image: string }>`
  background:
    linear-gradient(rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.56)),
    url(${({ $image }) => $image}) center / cover;
  color: var(--white);
  height: 280px;

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    padding: 24px 0 32px;
  }

  span {
    font-size: 32px;
    font-weight: 100;
    text-transform: capitalize;
  }

  h1 {
    font-size: 32px;
    font-weight: 900;
  }
`

const MenuList = styled.main`
  padding-top: 56px;

  .grid {
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .feedback {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`

export const Profile = () => {
  const { id } = useParams()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(() => setError('Nao foi possivel carregar o restaurante.'))
      .finally(() => setLoading(false))
  }, [])

  const restaurant = useMemo(
    () => restaurants.find((item) => String(item.id) === id),
    [id, restaurants]
  )

  return (
    <>
      <Header />
      {restaurant && (
        <Hero $image={restaurant.capa}>
          <div className="container">
            <span>{restaurant.tipo}</span>
            <h1>{restaurant.titulo}</h1>
          </div>
        </Hero>
      )}
      <MenuList className="container">
        {loading && <p className="feedback">Carregando cardapio...</p>}
        {error && <p className="feedback">{error}</p>}
        {!loading && !restaurant && !error && (
          <p className="feedback">Restaurante nao encontrado.</p>
        )}
        {restaurant && (
          <div className="grid">
            {restaurant.cardapio.map((item) => (
              <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </MenuList>
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  )
}
