import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { RestaurantCard } from '../components/RestaurantCard'
import { getRestaurants } from '../services/api'
import { Restaurant } from '../types'

const RestaurantList = styled.main`
  padding-top: 80px;

  .grid {
    display: grid;
    gap: 48px 80px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feedback {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }

  @media (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`

export const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(() => setError('Nao foi possivel carregar os restaurantes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      <RestaurantList className="container">
        {loading && <p className="feedback">Carregando restaurantes...</p>}
        {error && <p className="feedback">{error}</p>}
        {!loading && !error && (
          <div className="grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </RestaurantList>
    </>
  )
}
