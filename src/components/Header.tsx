import styled from 'styled-components'
import { ChefHat, ShoppingBag } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { open } from '../store/reducers/cart'

const HeaderWrapper = styled.header`
  background-color: var(--beige);
  padding: 40px 0;
`

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    font-size: 18px;
    color: var(--primary);
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

export const Header = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <HeaderWrapper>
      <HeaderBar className="container">
        <a href="/" className="brand">
          <ChefHat />
          eFood
        </a>
        <button onClick={() => dispatch(open())}>
          <ShoppingBag size={18} />
          {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
        </button>
      </HeaderBar>
    </HeaderWrapper>
  )
}
