import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { add } from '../../store/reducers/cart'
import { MenuItem } from '../../types'
import { formatCurrency } from '../../services/api'

const Overlay = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 20;
`

const Modal = styled.div`
  background-color: var(--primary);
  color: var(--light);
  display: grid;
  gap: 24px;
  grid-template-columns: 280px 1fr;
  max-width: 1024px;
  padding: 32px;
  position: relative;
  width: 100%;

  img {
    height: 280px;
    object-fit: cover;
    width: 100%;
  }

  .close {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--light);
    display: flex;
    position: absolute;
    right: 8px;
    top: 8px;
  }

  h2 {
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .portion {
    display: block;
    margin-bottom: 16px;
  }

  .add {
    background-color: var(--light);
    border: 0;
    color: var(--primary);
    font-size: 14px;
    font-weight: 700;
    padding: 4px 8px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;

    img {
      height: 220px;
    }
  }
`

type Props = {
  item: MenuItem | null
  onClose: () => void
}

export const ProductModal = ({ item, onClose }: Props) => {
  const dispatch = useDispatch()

  if (!item) return null

  const handleAdd = () => {
    dispatch(add(item))
    onClose()
  }

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="product-title">
      <Modal>
        <button className="close" type="button" aria-label="Fechar" onClick={onClose}>
          <X size={24} />
        </button>
        <img src={item.foto} alt={item.nome} />
        <div>
          <h2 id="product-title">{item.nome}</h2>
          <p>{item.descricao}</p>
          <span className="portion">Serve: {item.porcao}</span>
          <button className="add" type="button" onClick={handleAdd}>
            Adicionar ao carrinho - {formatCurrency(item.preco)}
          </button>
        </div>
      </Modal>
    </Overlay>
  )
}
