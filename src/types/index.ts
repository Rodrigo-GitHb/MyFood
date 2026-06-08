export type Dish = {
  id: number
  name: string
  restaurant: string
  category: string
  description: string
  portion: string
  price: number
  image: string
}

export type CartItem = Dish & {
  quantity: number
}

export type DeliveryForm = {
  receiver: string
  description: string
  city: string
  zipCode: string
  number: string
  complement: string
}

export type PaymentForm = {
  cardName: string
  cardNumber: string
  code: string
  month: string
  year: string
}

export type OrderResponse = {
  orderId: string
}
