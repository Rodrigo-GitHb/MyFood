import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store'
import { clear, close, remove } from '../../store/reducers/cart'
import { formatCurrency, sendOrder } from '../../services/api'

type Step = 'cart' | 'delivery' | 'payment' | 'success'

const Drawer = styled.aside`
  display: flex;
  inset: 0;
  justify-content: flex-end;
  position: fixed;
  z-index: 30;

  .overlay {
    background-color: rgba(0, 0, 0, 0.8);
    inset: 0;
    position: absolute;
  }

  .sidebar {
    background-color: var(--primary);
    color: var(--light);
    max-width: 360px;
    min-height: 100%;
    overflow-y: auto;
    padding: 32px 8px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
    margin-bottom: 40px;
  }

  .cart-item {
    background-color: var(--light);
    color: var(--primary);
    display: grid;
    gap: 8px;
    grid-template-columns: 80px 1fr 24px;
    min-height: 100px;
    padding: 8px;
  }

  .cart-item img {
    height: 80px;
    object-fit: cover;
    width: 80px;
  }

  .cart-item h3 {
    font-size: 18px;
    font-weight: 900;
    line-height: 21px;
    margin-bottom: 16px;
  }

  .cart-item span {
    display: block;
    font-size: 14px;
    line-height: 22px;
  }

  .remove {
    align-self: end;
    background: transparent;
    border: 0;
    color: var(--primary);
    display: flex;
  }

  .total {
    display: flex;
    font-size: 14px;
    font-weight: 700;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 14px;
    font-weight: 700;
  }

  input {
    background-color: var(--light);
    border: 1px solid var(--light);
    color: var(--dark);
    font-size: 14px;
    font-weight: 700;
    height: 32px;
    padding: 8px;
    width: 100%;
  }

  .row {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr 1fr;
  }

  .error {
    color: var(--light);
    font-size: 12px;
    font-weight: 700;
  }

  .button {
    background-color: var(--light);
    border: 0;
    color: var(--primary);
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-top: 8px;
    padding: 4px;
    text-align: center;
    width: 100%;
  }

  .button + .button {
    margin-top: 8px;
  }
`

const schema = Yup.object({
  receiver: Yup.string().min(5, 'Informe o nome completo').required('Campo obrigatorio'),
  description: Yup.string().required('Campo obrigatorio'),
  city: Yup.string().required('Campo obrigatorio'),
  zipCode: Yup.string().min(8, 'CEP invalido').required('Campo obrigatorio'),
  number: Yup.string().required('Campo obrigatorio'),
  cardName: Yup.string().required('Campo obrigatorio'),
  cardNumber: Yup.string().min(16, 'Cartao invalido').required('Campo obrigatorio'),
  code: Yup.string().min(3, 'CVV invalido').required('Campo obrigatorio'),
  month: Yup.string().min(2, 'Mes invalido').required('Campo obrigatorio'),
  year: Yup.string().min(4, 'Ano invalido').required('Campo obrigatorio')
})

export const CartDrawer = () => {
  const dispatch = useDispatch()
  const { isOpen, items } = useSelector((state: RootState) => state.cart)
  const [step, setStep] = useState<Step>('cart')
  const [orderId, setOrderId] = useState('')
  const [submitError, setSubmitError] = useState('')

  const total = items.reduce((sum, item) => sum + item.preco * item.quantity, 0)

  const form = useFormik({
    initialValues: {
      receiver: '',
      description: '',
      city: '',
      zipCode: '',
      number: '',
      complement: '',
      cardName: '',
      cardNumber: '',
      code: '',
      month: '',
      year: ''
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setSubmitError('')

      try {
        const response = await sendOrder({
          products: items.map((item) => ({
            id: item.id,
            price: item.preco
          })),
          delivery: {
            receiver: values.receiver,
            address: {
              description: values.description,
              city: values.city,
              zipCode: values.zipCode,
              number: Number(values.number),
              complement: values.complement
            }
          },
          payment: {
            card: {
              name: values.cardName,
              number: values.cardNumber,
              code: Number(values.code),
              expires: {
                month: Number(values.month),
                year: Number(values.year)
              }
            }
          }
        })

        setOrderId(response.orderId)
        setStep('success')
        dispatch(clear())
        form.resetForm()
      } catch {
        setSubmitError('Nao foi possivel concluir o pedido. Tente novamente.')
      }
    }
  })

  if (!isOpen) return null

  const getError = (field: keyof typeof form.values) =>
    form.touched[field] && form.errors[field] ? (
      <span className="error">{form.errors[field]}</span>
    ) : null

  const closeDrawer = () => {
    dispatch(close())
    if (step === 'success') {
      setStep('cart')
      setOrderId('')
    }
  }

  return (
    <Drawer>
      <div className="overlay" onClick={closeDrawer} />
      <div className="sidebar">
        {step === 'cart' && (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <img src={item.foto} alt={item.nome} />
                  <div>
                    <h3>{item.nome}</h3>
                    <span>{formatCurrency(item.preco)}</span>
                    <span>Quantidade: {item.quantity}</span>
                  </div>
                  <button
                    className="remove"
                    type="button"
                    aria-label={`Remover ${item.nome}`}
                    onClick={() => dispatch(remove(item.id))}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
            {items.length === 0 ? (
              <p>Seu carrinho esta vazio.</p>
            ) : (
              <>
                <div className="total">
                  <span>Valor total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <button className="button" type="button" onClick={() => setStep('delivery')}>
                  Continuar com a entrega
                </button>
              </>
            )}
          </>
        )}

        {step === 'delivery' && (
          <form>
            <h2>Entrega</h2>
            <label htmlFor="receiver">Quem ira receber</label>
            <input id="receiver" name="receiver" value={form.values.receiver} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('receiver')}

            <label htmlFor="description">Endereco</label>
            <input id="description" name="description" value={form.values.description} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('description')}

            <label htmlFor="city">Cidade</label>
            <input id="city" name="city" value={form.values.city} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('city')}

            <div className="row">
              <div>
                <label htmlFor="zipCode">CEP</label>
                <input id="zipCode" name="zipCode" value={form.values.zipCode} onChange={form.handleChange} onBlur={form.handleBlur} />
                {getError('zipCode')}
              </div>
              <div>
                <label htmlFor="number">Numero</label>
                <input id="number" name="number" value={form.values.number} onChange={form.handleChange} onBlur={form.handleBlur} />
                {getError('number')}
              </div>
            </div>

            <label htmlFor="complement">Complemento (opcional)</label>
            <input id="complement" name="complement" value={form.values.complement} onChange={form.handleChange} onBlur={form.handleBlur} />

            <button className="button" type="button" onClick={() => setStep('payment')}>
              Continuar com o pagamento
            </button>
            <button className="button" type="button" onClick={() => setStep('cart')}>
              Voltar para o carrinho
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={form.handleSubmit}>
            <h2>Pagamento - Valor a pagar {formatCurrency(total)}</h2>
            <label htmlFor="cardName">Nome no cartao</label>
            <input id="cardName" name="cardName" value={form.values.cardName} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('cardName')}

            <label htmlFor="cardNumber">Numero do cartao</label>
            <input id="cardNumber" name="cardNumber" value={form.values.cardNumber} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('cardNumber')}

            <div className="row">
              <div>
                <label htmlFor="code">CVV</label>
                <input id="code" name="code" value={form.values.code} onChange={form.handleChange} onBlur={form.handleBlur} />
                {getError('code')}
              </div>
              <div>
                <label htmlFor="month">Mes de vencimento</label>
                <input id="month" name="month" value={form.values.month} onChange={form.handleChange} onBlur={form.handleBlur} />
                {getError('month')}
              </div>
            </div>

            <label htmlFor="year">Ano de vencimento</label>
            <input id="year" name="year" value={form.values.year} onChange={form.handleChange} onBlur={form.handleBlur} />
            {getError('year')}

            {submitError && <span className="error">{submitError}</span>}
            <button className="button" type="submit">
              Finalizar pagamento
            </button>
            <button className="button" type="button" onClick={() => setStep('delivery')}>
              Voltar para a edicao de endereco
            </button>
          </form>
        )}

        {step === 'success' && (
          <>
            <h2>Pedido realizado - {orderId}</h2>
            <p>
              Estamos felizes em informar que seu pedido ja esta em processo de preparacao e, em
              breve, sera entregue no endereco fornecido.
            </p>
            <p>
              Gostariamos de ressaltar que nossos entregadores nao estao autorizados a realizar
              cobrancas extras.
            </p>
            <p>
              Lembre-se da importancia de higienizar as maos apos o recebimento do pedido,
              garantindo assim sua seguranca e bem-estar durante a refeicao.
            </p>
            <p>Esperamos que desfrute de uma experiencia gastronomica prazerosa. Bom apetite!</p>
            <button className="button" type="button" onClick={closeDrawer}>
              Concluir
            </button>
          </>
        )}
      </div>
    </Drawer>
  )
}
