import { CheckoutPayload, OrderResponse, Restaurant } from '../types'

const API_URL = 'https://api-ebac.vercel.app/api/efood'

export const getRestaurants = async () => {
  const response = await fetch(`${API_URL}/restaurantes`)

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os restaurantes')
  }

  return response.json() as Promise<Restaurant[]>
}

export const sendOrder = async (payload: CheckoutPayload) => {
  const response = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel concluir o pedido')
  }

  return response.json() as Promise<OrderResponse>
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
