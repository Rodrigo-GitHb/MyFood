import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Star } from 'lucide-react'
import { Restaurant } from '../../types'

const Card = styled.article`
  background-color: var(--white);
  border: 1px solid var(--primary);
  color: var(--primary);
  min-height: 398px;
  position: relative;

  img {
    height: 217px;
    object-fit: cover;
    width: 100%;
  }

  .tags {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    left: 8px;
    position: absolute;
    right: 8px;
    top: 16px;
  }

  .tag {
    background-color: var(--primary);
    color: var(--light);
    font-size: 12px;
    font-weight: 700;
    line-height: 14px;
    padding: 6px 8px;
    text-transform: capitalize;
  }

  .content {
    padding: 8px;
  }

  .title-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  h2,
  .rating {
    font-size: 18px;
    font-weight: 700;
  }

  .rating {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
  }

  a {
    background-color: var(--primary);
    color: var(--light);
    display: inline-block;
    font-size: 14px;
    font-weight: 700;
    padding: 4px 6px;
  }
`

type Props = {
  restaurant: Restaurant
}

export const RestaurantCard = ({ restaurant }: Props) => (
  <Card>
    <img src={restaurant.capa} alt={restaurant.titulo} />
    <div className="tags">
      {restaurant.destacado && <span className="tag">Destaque da semana</span>}
      <span className="tag">{restaurant.tipo}</span>
    </div>
    <div className="content">
      <div className="title-row">
        <h2>{restaurant.titulo}</h2>
        <span className="rating">
          {restaurant.avaliacao}
          <Star size={20} fill="var(--primary)" />
        </span>
      </div>
      <p>{restaurant.descricao}</p>
      <Link to={`/perfil/${restaurant.id}`}>Saiba mais</Link>
    </div>
  </Card>
)
