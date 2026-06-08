import { FormEvent, useMemo, useState } from 'react'
import {
  BadgeCheck,
  ChefHat,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck
} from 'lucide-react'

const CHECKOUT_URL = 'https://api-ebac.vercel.app/api/efood/checkout'

const PERSONAL_INFO = {
  brandName: 'eFood',
  ownerName: 'Seu nome aqui',
  city: 'Sua cidade',
  signature: 'Delivery com carinho, comida boa e checkout sem enrolacao.'
}

type Dish = {
  id: number
  name: string
  restaurant: string
  category: string
  description: string
  portion: string
  price: number
  image: string
}

type CartItem = Dish & {
  quantity: number
}

type DeliveryForm = {
  receiver: string
  description: string
  city: string
  zipCode: string
  number: string
  complement: string
}

type PaymentForm = {
  cardName: string
  cardNumber: string
  code: string
  month: string
  year: string
}

type OrderResponse = {
  orderId: string
}

const dishes: Dish[] = [
  {
    id: 101,
    name: 'Pizza Margherita',
    restaurant: 'La Dolce Vita',
    category: 'Italiana',
    description:
      'Massa artesanal, molho de tomates frescos, mozzarella e manjericao.',
    portion: 'Serve 2 pessoas',
    price: 69.9,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 102,
    name: 'Sushi Especial',
    restaurant: 'Sakura House',
    category: 'Japonesa',
    description:
      'Combinado com sashimis, niguiris e rolls crocantes preparados na hora.',
    portion: '20 pecas',
    price: 92,
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 103,
    name: 'Ravioli ao Sugo',
    restaurant: 'Nonna Rosa',
    category: 'Massas',
    description:
      'Ravioli recheado com queijo, finalizado com molho sugo e parmesao.',
    portion: 'Serve 1 pessoa',
    price: 54.5,
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 104,
    name: 'Burger da Casa',
    restaurant: 'Urban Grill',
    category: 'Lanches',
    description:
      'Blend bovino, cheddar, cebola caramelizada e maionese defumada.',
    portion: 'Acompanha fritas',
    price: 47.9,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80'
  }
]

const initialDelivery: DeliveryForm = {
  receiver: '',
  description: '',
  city: '',
  zipCode: '',
  number: '',
  complement: ''
}

const initialPayment: PaymentForm = {
  cardName: '',
  cardNumber: '',
  code: '',
  month: '',
  year: ''
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

const onlyNumbers = (value: string) => value.replace(/\D/g, '')

export function App() {
  const [cart, setCart] = useState<CartItem[]>([dishes[0], dishes[1]].map((dish) => ({ ...dish, quantity: 1 })))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [step, setStep] = useState<'cart' | 'delivery' | 'payment' | 'success'>('cart')
  const [delivery, setDelivery] = useState(initialDelivery)
  const [payment, setPayment] = useState(initialPayment)
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  )

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (dish: Dish) => {
    setCart((items) => {
      const current = items.find((item) => item.id === dish.id)

      if (current) {
        return items.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...items, { ...dish, quantity: 1 }]
    })
    setDrawerOpen(true)
    setStep('cart')
  }

  const updateQuantity = (id: number, amount: number) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setCart((items) => items.filter((item) => item.id !== id))
  }

  const validateDelivery = () =>
    delivery.receiver.trim().length >= 3 &&
    delivery.description.trim() &&
    delivery.city.trim() &&
    onlyNumbers(delivery.zipCode).length === 8 &&
    Number(delivery.number) > 0

  const validatePayment = () =>
    payment.cardName.trim().length >= 3 &&
    onlyNumbers(payment.cardNumber).length >= 13 &&
    onlyNumbers(payment.code).length >= 3 &&
    Number(payment.month) >= 1 &&
    Number(payment.month) <= 12 &&
    onlyNumbers(payment.year).length === 2

  const goToPayment = () => {
    setError('')

    if (!validateDelivery()) {
      setError('Preencha os dados de entrega antes de continuar.')
      return
    }

    setStep('payment')
  }

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!cart.length) {
      setError('Adicione pelo menos um item ao carrinho.')
      setStep('cart')
      return
    }

    if (!validatePayment()) {
      setError('Confira os dados do cartao antes de finalizar.')
      return
    }

    const payload = {
      products: cart.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          id: item.id,
          price: item.price
        }))
      ),
      delivery: {
        receiver: delivery.receiver,
        address: {
          description: delivery.description,
          city: delivery.city,
          zipCode: delivery.zipCode,
          number: Number(delivery.number),
          complement: delivery.complement
        }
      },
      payment: {
        card: {
          name: payment.cardName,
          number: onlyNumbers(payment.cardNumber),
          code: Number(payment.code),
          expires: {
            month: Number(payment.month),
            year: Number(payment.year)
          }
        }
      }
    }

    try {
      setLoading(true)
      const response = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Nao foi possivel finalizar o pedido.')
      }

      const data = (await response.json()) as OrderResponse
      setOrder(data)
      setCart([])
      setStep('success')
    } catch {
      setError('A API nao respondeu como esperado. Tente novamente em alguns instantes.')
    } finally {
      setLoading(false)
    }
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setError('')
    if (step === 'success') {
      setStep('cart')
      setDelivery(initialDelivery)
      setPayment(initialPayment)
      setOrder(null)
    }
  }

  return (
    <>
      <header className="site-header">
        <nav className="container nav" aria-label="Navegacao principal">
          <a href="#inicio" className="brand">
            <ChefHat size={28} />
            <span>{PERSONAL_INFO.brandName}</span>
          </a>
          <div className="nav-actions">
            <a href="#cardapio">Cardapio</a>
            <button className="cart-button" onClick={() => setDrawerOpen(true)}>
              <ShoppingBag size={18} />
              {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
            </button>
          </div>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={16} />
                Inspirado no layout eFood da EBAC
              </span>
              <h1>Restaurantes especiais entregues na sua porta.</h1>
              <p>
                Escolha seus pratos favoritos, revise o carrinho e finalize o
                pedido com entrega e pagamento em uma experiencia clara.
              </p>
              <div className="hero-actions">
                <a className="primary-link" href="#cardapio">
                  Ver pratos
                </a>
                <button className="secondary-link" onClick={() => setDrawerOpen(true)}>
                  Abrir carrinho
                </button>
              </div>
            </div>
            <div className="hero-plate" aria-label="Pizza artesanal">
              <img src={dishes[0].image} alt="Pizza margherita artesanal" />
              <div className="floating-ticket">
                <Truck size={18} />
                Entrega rapida em {PERSONAL_INFO.city}
              </div>
            </div>
          </div>
        </section>

        <section className="container feature-row" aria-label="Destaques">
          <div>
            <BadgeCheck size={22} />
            Checkout com POST real
          </div>
          <div>
            <MapPin size={22} />
            Pagina de entrega
          </div>
          <div>
            <ReceiptText size={22} />
            Confirmacao com orderId
          </div>
        </section>

        <section id="cardapio" className="container menu-section">
          <div className="section-heading">
            <span>Selecao da casa</span>
            <h2>Cardapio em destaque</h2>
          </div>
          <div className="dish-grid">
            {dishes.map((dish) => (
              <article className="dish-card" key={dish.id}>
                <img src={dish.image} alt={dish.name} />
                <div className="dish-body">
                  <div className="dish-meta">
                    <span>{dish.category}</span>
                    <strong>{formatCurrency(dish.price)}</strong>
                  </div>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <small>{dish.restaurant} | {dish.portion}</small>
                  <button onClick={() => addToCart(dish)}>
                    <Plus size={18} />
                    Adicionar ao carrinho
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <ChefHat size={28} />
        <strong>{PERSONAL_INFO.brandName}</strong>
        <p>
          Projeto desenvolvido por {PERSONAL_INFO.ownerName}. {PERSONAL_INFO.signature}
        </p>
      </footer>

      <aside className={`checkout-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
        <button className="overlay" onClick={closeDrawer} aria-label="Fechar carrinho" />
        <form className="panel" onSubmit={submitOrder}>
          {step === 'cart' && (
            <>
              <PanelHeader icon={<ShoppingBag size={24} />} title="Carrinho" />
              {cart.length ? (
                <div className="cart-list">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{formatCurrency(item.price)} cada</span>
                        <div className="quantity">
                          <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty">Seu carrinho esta vazio.</p>
              )}
              <Summary subtotal={subtotal} />
              <button
                className="full-button"
                type="button"
                disabled={!cart.length}
                onClick={() => setStep('delivery')}
              >
                Continuar para entrega
              </button>
            </>
          )}

          {step === 'delivery' && (
            <>
              <PanelHeader icon={<Truck size={24} />} title="Entrega" />
              <label>
                Quem ira receber
                <input
                  value={delivery.receiver}
                  onChange={(event) =>
                    setDelivery({ ...delivery, receiver: event.target.value })
                  }
                  placeholder="Nome do destinatario"
                  required
                />
              </label>
              <label>
                Endereco
                <input
                  value={delivery.description}
                  onChange={(event) =>
                    setDelivery({ ...delivery, description: event.target.value })
                  }
                  placeholder="Rua, avenida ou travessa"
                  required
                />
              </label>
              <label>
                Cidade
                <input
                  value={delivery.city}
                  onChange={(event) =>
                    setDelivery({ ...delivery, city: event.target.value })
                  }
                  placeholder="Sua cidade"
                  required
                />
              </label>
              <div className="field-row">
                <label>
                  CEP
                  <input
                    value={delivery.zipCode}
                    onChange={(event) =>
                      setDelivery({ ...delivery, zipCode: event.target.value })
                    }
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                </label>
                <label>
                  Numero
                  <input
                    value={delivery.number}
                    onChange={(event) =>
                      setDelivery({ ...delivery, number: event.target.value })
                    }
                    placeholder="123"
                    required
                  />
                </label>
              </div>
              <label>
                Complemento
                <input
                  value={delivery.complement}
                  onChange={(event) =>
                    setDelivery({ ...delivery, complement: event.target.value })
                  }
                  placeholder="Apto, bloco, referencia"
                />
              </label>
              <DrawerError message={error} />
              <button className="full-button" type="button" onClick={goToPayment}>
                Continuar com pagamento
              </button>
              <button className="text-button" type="button" onClick={() => setStep('cart')}>
                Voltar para carrinho
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <PanelHeader icon={<CreditCard size={24} />} title={`Pagamento - ${formatCurrency(subtotal)}`} />
              <label>
                Nome no cartao
                <input
                  value={payment.cardName}
                  onChange={(event) =>
                    setPayment({ ...payment, cardName: event.target.value })
                  }
                  placeholder="Nome como esta no cartao"
                  required
                />
              </label>
              <label>
                Numero do cartao
                <input
                  value={payment.cardNumber}
                  onChange={(event) =>
                    setPayment({ ...payment, cardNumber: event.target.value })
                  }
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </label>
              <div className="field-row">
                <label>
                  CVV
                  <input
                    value={payment.code}
                    onChange={(event) =>
                      setPayment({ ...payment, code: event.target.value })
                    }
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </label>
                <label>
                  Mes
                  <input
                    value={payment.month}
                    onChange={(event) =>
                      setPayment({ ...payment, month: event.target.value })
                    }
                    placeholder="12"
                    maxLength={2}
                    required
                  />
                </label>
                <label>
                  Ano
                  <input
                    value={payment.year}
                    onChange={(event) =>
                      setPayment({ ...payment, year: event.target.value })
                    }
                    placeholder="28"
                    maxLength={2}
                    required
                  />
                </label>
              </div>
              <DrawerError message={error} />
              <button className="full-button" type="submit" disabled={loading}>
                {loading ? 'Finalizando pedido...' : 'Finalizar pagamento'}
              </button>
              <button className="text-button" type="button" onClick={() => setStep('delivery')}>
                Voltar para entrega
              </button>
            </>
          )}

          {step === 'success' && order && (
            <div className="success">
              <BadgeCheck size={42} />
              <h2>Pedido realizado - {order.orderId}</h2>
              <p>
                Estamos felizes em informar que seu pedido ja esta em processo
                de preparacao e em breve sera entregue no endereco fornecido.
              </p>
              <p>
                Nossos entregadores nao estao autorizados a realizar cobrancas
                extras. Higienize as maos apos o recebimento e bom apetite.
              </p>
              <button className="full-button" type="button" onClick={closeDrawer}>
                Concluir
              </button>
            </div>
          )}
        </form>
      </aside>
    </>
  )
}

function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="panel-header">
      {icon}
      <h2>{title}</h2>
    </div>
  )
}

function Summary({ subtotal }: { subtotal: number }) {
  return (
    <div className="summary">
      <span>Total</span>
      <strong>{formatCurrency(subtotal)}</strong>
    </div>
  )
}

function DrawerError({ message }: { message: string }) {
  if (!message) {
    return null
  }

  return <p className="form-error">{message}</p>
}
