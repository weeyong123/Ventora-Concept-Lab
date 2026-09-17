export interface Product {
  id: string;
  name: string;
  category: 'strawberries' | 'cakes' | 'cupcakes' | 'treats' | 'holiday';
  image: string;
  description: string;
  priceTag: string;
  tag?: string;
  flavorNotes: string[];
  servings?: string;
}

export interface OrderFormState {
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: 'birthday' | 'wedding' | 'corporate' | 'celebration' | 'just_because';
  guestCount: number;
  dessertInterests: string[];
  themeOrColors: string;
  specialRequests: string;
  deliveryOrPickup: 'pickup' | 'delivery';
}
