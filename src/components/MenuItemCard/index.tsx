import styled from 'styled-components'
import { MenuItem } from '../../types'

const Card = styled.article`
  background-color: var(--primary);
  color: var(--light);
  display: flex;
  flex-direction: column;
  min-height: 338px;
  padding: 8px;

  img {
    height: 167px;
    object-fit: cover;
    width: 100%;
  }

  h2 {
    font-size: 16px;
    font-weight: 900;
    line-height: 19px;
    margin: 8px 0;
  }

  p {
    flex: 1;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }

  button {
    background-color: var(--light);
    border: 0;
    color: var(--primary);
    font-size: 14px;
    font-weight: 700;
    padding: 4px;
    width: 100%;
  }
`

type Props = {
  item: MenuItem
  onClick: () => void
}

export const MenuItemCard = ({ item, onClick }: Props) => (
  <Card>
    <img src={item.foto} alt={item.nome} />
    <h2>{item.nome}</h2>
    <p>{item.descricao}</p>
    <button type="button" onClick={onClick}>
      Adicionar ao carrinho
    </button>
  </Card>
)
