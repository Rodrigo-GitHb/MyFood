import styled from 'styled-components'
import { Plus } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { add, open } from '../store/reducers/cart'
import { Dish } from '../types'

const Card = styled.article`
  background-color: var(--white);
  border: 1px solid var(--primary);
  padding: 8px;
  color: var(--primary);
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 167px;
    object-fit: cover;
    margin-bottom: 8px;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  h3 {
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
    flex-grow: 1;
  }

  button {
    background-color: var(--primary);
    color: var(--beige);
    border: none;
    padding: 4px 0;
    font-weight: bold;
    font-size: 14px;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
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
      <div className="content">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <button onClick={handleAddToCart}>
          <Plus size={18} />
          Adicionar ao carrinho
        </button>
      </div>
    </Card>
  )
}
