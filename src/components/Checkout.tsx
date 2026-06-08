import { useFormik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { close, clear } from '../store/reducers/cart'
import { useState } from 'react'

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 100;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .sidebar {
    position: relative;
    background-color: var(--primary);
    width: 360px;
    padding: 32px 8px;
    z-index: 1;
    color: var(--background);

    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 14px;
        font-weight: bold;
      }

      input {
        background-color: var(--background);
        border: 1px solid var(--background);
        padding: 8px;
        font-weight: bold;
        color: var(--text);
      }

      .error {
        color: #ff0000;
        font-size: 12px;
      }

      button {
        background-color: var(--background);
        color: var(--primary);
        border: none;
        padding: 8px;
        font-weight: bold;
        margin-top: 8px;
        cursor: pointer;
      }
    }
  }
`

export const Checkout = () => {
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const dispatch = useDispatch()
  const { isOpen, items } = useSelector((state: RootState) => state.cart)
  
  const totalPrice = items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const form = useFormik({
    initialValues: {
      receiver: '',
      address: '',
      city: '',
      zipCode: '',
      number: '',
      complement: '',
      cardName: '',
      cardNumber: '',
      cvv: '',
      expiresMonth: '',
      expiresYear: ''
    },
    validationSchema: Yup.object({
      receiver: Yup.string().min(5, 'Nome muito curto').required('Obrigatório'),
      address: Yup.string().required('Obrigatório'),
      city: Yup.string().required('Obrigatório'),
      zipCode: Yup.string().min(8, 'CEP inválido').required('Obrigatório'),
      number: Yup.string().required('Obrigatório'),
      cardName: Yup.string().required('Obrigatório'),
      cardNumber: Yup.string().min(16, 'Cartão inválido').required('Obrigatório'),
      cvv: Yup.string().min(3, 'CVV inválido').required('Obrigatório')
    }),
    onSubmit: async (values) => {
      setLoading(true)
      setError('')
      
      const payload = {
        products: items.map(item => ({
          id: item.id,
          price: item.price
        })),
        delivery: {
          receiver: values.receiver,
          address: {
            description: values.address,
            city: values.city,
            zipCode: values.zipCode,
            number: Number(values.number),
            complement: values.complement || ''
          }
        },
        payment: {
          card: {
            name: values.cardName,
            number: values.cardNumber,
            code: Number(values.cvv),
            expires: {
              month: Number(values.expiresMonth),
              year: Number(values.expiresYear)
            }
          }
        }
      }

      try {
        const response = await fetch('https://api-ebac.vercel.app/api/efood/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          const data = await response.json()
          setOrderId(data.orderId)
          setIsCompleted(true)
          dispatch(clear())
        } else {
          setError('Ocorreu um erro ao processar o pagamento. Verifique os dados e tente novamente.')
        }
      } catch (err) {
        setError('Erro de conexão com o servidor.')
      } finally {
        setLoading(false)
      }
    }
  })

  if (!isOpen) return null

  return (
    <Drawer>
      <div className="overlay" onClick={() => dispatch(close())} />
      <div className="sidebar">
        {!isCompleted ? (
          <>
            <h3>Carrinho</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px' }}>
              {items.map((item) => (
                <li key={item.id} style={{ backgroundColor: 'var(--background)', color: 'var(--primary)', padding: '8px', marginBottom: '8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ fontSize: '12px' }}>{item.quantity}x {formatCurrency(item.price)}</p>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

            <h3>Entrega</h3>
            <form onSubmit={form.handleSubmit}>
              <label htmlFor="receiver">Quem irá receber</label>
              <input id="receiver" name="receiver" type="text" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.receiver} />
              {form.touched.receiver && form.errors.receiver ? <div className="error">{form.errors.receiver}</div> : null}

              <label htmlFor="address">Endereço</label>
              <input id="address" name="address" type="text" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.address} />
              
              <label htmlFor="city">Cidade</label>
              <input id="city" name="city" type="text" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.city} />

              <h3>Pagamento</h3>
              <label htmlFor="cardName">Nome no cartão</label>
              <input id="cardName" name="cardName" type="text" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.cardName} />

              <label htmlFor="cardNumber">Número do cartão</label>
              <input id="cardNumber" name="cardNumber" type="text" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.cardNumber} />

              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? 'Processando...' : 'Finalizar pagamento'}
              </button>
              <button type="button" onClick={() => dispatch(close())}>Voltar ao carrinho</button>
            </form>
          </>
        ) : (
          <>
            <h3>Pedido realizado - {orderId}</h3>
            <p>Estamos felizes em informar que seu pedido já está em processo de preparação e, em breve, será entregue no endereço fornecido.</p>
            <p>Gostaríamos de ressaltar que nossos entregadores não estão autorizados a realizar cobranças extras. </p>
            <p>Lembre-se da importância de higienizar as mãos após o recebimento do pedido, garantindo assim sua segurança e bem-estar durante a refeição.</p>
            <p>Esperamos que desfrute de uma experiência gastronômica prazerosa e agradável. Bom apetite!</p>
            <button onClick={() => { setIsCompleted(false); setOrderId(''); dispatch(close()); }}>Concluir</button>
          </>
        )}
      </div>
    </Drawer>
  )
}
