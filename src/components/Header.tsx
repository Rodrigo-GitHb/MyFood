import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { ShoppingBag } from 'lucide-react'
import { RootState } from '../store'
import { open } from '../store/reducers/cart'
import { Logo } from './Logo'

const HeaderWrapper = styled.header<{ $home: boolean }>`
  background:
    linear-gradient(rgba(255, 235, 217, 0.92), rgba(255, 235, 217, 0.92)),
    radial-gradient(circle at 20% 20%, rgba(230, 103, 103, 0.2) 0 2px, transparent 3px),
    radial-gradient(circle at 80% 30%, rgba(230, 103, 103, 0.16) 0 3px, transparent 4px),
    var(--light);
  background-size: auto, 46px 46px, 72px 72px;
  padding: ${({ $home }) => ($home ? '40px 0' : '32px 0')};
`

const HomeHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 138px;
  min-height: 342px;

  h1 {
    max-width: 540px;
    color: var(--primary);
    font-size: 36px;
    font-weight: 900;
    line-height: 42px;
    text-align: center;
  }

  @media (max-width: 640px) {
    gap: 80px;

    h1 {
      font-size: 28px;
      line-height: 34px;
    }
  }
`

const ProfileBar = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  .back-link,
  button {
    color: var(--primary);
    font-size: 18px;
    font-weight: 900;
  }

  button {
    align-items: center;
    background: transparent;
    border: 0;
    display: inline-flex;
    gap: 8px;
    justify-self: flex-end;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 18px;
    justify-items: center;

    button {
      justify-self: center;
    }
  }
`

export const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { items } = useSelector((state: RootState) => state.cart)
  const isHome = location.pathname === '/'
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <HeaderWrapper $home={isHome}>
      {isHome ? (
        <HomeHero className="container">
          <Link to="/" aria-label="Ir para a home">
            <Logo />
          </Link>
          <h1>Viva experiências gastronômicas no conforto da sua casa</h1>
        </HomeHero>
      ) : (
        <ProfileBar className="container">
          <Link className="back-link" to="/">
            Restaurantes
          </Link>
          <Link to="/" aria-label="Ir para a home">
            <Logo />
          </Link>
          <button type="button" onClick={() => dispatch(open())}>
            <ShoppingBag size={20} />
            {totalItems} produto{totalItems === 1 ? '' : 's'} no carrinho
          </button>
        </ProfileBar>
      )}
    </HeaderWrapper>
  )
}
