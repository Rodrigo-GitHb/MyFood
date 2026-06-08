import styled from 'styled-components'
import { Plus } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { add, open } from '../store/reducers/cart'
import { Dish } from '../types'

const Card = styled.article`
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 8px;
  color: var(--primary);

  img {
    width: 100%;
    height: 167px;
    object-fit: cover;
    border-radius: 4px;
  }

  h3 {
    font-size: 18px;
    font-weight: bold;
    margin: 8px 0;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }

  button {
    background-color: var(--primary);
    color: var(--background);
    border: none;
    padding: 4px 0;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`

type Props = {
  dish: Dish
}

export const DishCard = ({ dish }: Props) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(add(dish))
    dispatch(open())
  }

  return (
    <Card>
      <img src={dish.image} alt={dish.name} />
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <button onClick={handleAddToCart}>
        <Plus size={18} />
        Adicionar ao carrinho
      </button>
    </Card>
  )
}
