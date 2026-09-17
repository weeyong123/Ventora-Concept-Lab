import { Product } from '../types';

export const HERO_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=90";
export const HERO_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=85";
export const CATERING_CAKE_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85";
export const POLAROID_CUPCAKES_IMAGE = "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80";
export const POLAROID_BOX_IMAGE = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80";

export const HIGHLIGHT_PRODUCTS: Product[] = [
  {
    id: 'choc-strawberries', name: 'Chocolate Covered Strawberries', category: 'strawberries',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    description: 'Giant plump California strawberries hand-dipped in Belgian milk chocolate with signature strawberry blush & white drizzle.',
    priceTag: 'From $28 / dozen', tag: 'Bestseller',
    flavorNotes: ['Belgian Milk Chocolate', 'Fresh California Berries', 'Ruby Drizzle'], servings: '12-24 pieces'
  },
  {
    id: 'pumpkin-treat', name: 'Pumpkin', category: 'cakes',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Spiced pumpkin mini cake filled with brown butter cream cheese frosting and dusted with candied pecans.',
    priceTag: '$6.50 / each', tag: 'Seasonal',
    flavorNotes: ['Roasted Pumpkin Purée', 'Warm Spice Blend', 'Cream Cheese'], servings: 'Single serving'
  },
  {
    id: 'strawberry-delight', name: 'Strawberry', category: 'strawberries',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh berry dipped in velvety pink strawberry chocolate with crispy ruby crunch pearls.',
    priceTag: 'From $30 / dozen', tag: 'Crowd Favorite',
    flavorNotes: ['Ruby Strawberry Chocolate', 'Crunch Pearls', 'Natural Berry Sweetness'], servings: '12 pieces'
  },
  {
    id: 'birthday-cake', name: 'Birthday Cake', category: 'cakes',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    description: 'Layers of moist vanilla funfetti cake enveloped in whipped vanilla buttercream and joyful rainbow confetti.',
    priceTag: 'From $48 (6-inch)', tag: 'Party Must-Have',
    flavorNotes: ['Madagascar Vanilla', 'Sprinkles', 'Silky Buttercream'], servings: '8-10 slices'
  },
  {
    id: 'cupcake-classic', name: 'Cupcake', category: 'cupcakes',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80',
    description: 'Signature golden cake piped high with swirl buttercream frosting, delicate sprinkles, and berry accent.',
    priceTag: '$4.25 / each ($45/dozen)', tag: 'Daily Bake',
    flavorNotes: ['Golden Vanilla Bean', 'Fluffy Swirl', 'Sugar Pearls'], servings: 'Individual or dozen'
  },
  {
    id: 'champagne-truffles', name: 'Champagne', category: 'treats',
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    description: 'Effervescent pink champagne cake truffles cloaked in white chocolate and hand-painted with edible 24k gold shimmer.',
    priceTag: '$34 / box of 8', tag: 'Luxury',
    flavorNotes: ['Sparkling Rosé Reduction', 'White Chocolate Shell', '24k Gold Shimmer'], servings: '8 pieces'
  },
  {
    id: 'pretzel-twists', name: 'Pretzel', category: 'treats',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy salted pretzel twists drenched in rich dark chocolate, buttery caramel swirl, and sea salt flakes.',
    priceTag: '$22 / gift bag', tag: 'Sweet & Salty',
    flavorNotes: ['Maldon Sea Salt', 'Fudge Chocolate', 'Artisan Caramel'], servings: '16 twists'
  },
  {
    id: 'upside-down-cake', name: 'Upside-Down Cake', category: 'cakes',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Caramelized brown sugar pineapple rings baked on tender sponge, crowned with ruby maraschino cherry.',
    priceTag: '$7.00 / mini cake', tag: 'Southern Classic',
    flavorNotes: ['Caramelized Pineapple', 'Brown Butter Crumble', 'Sweet Cherry'], servings: '1-2 servings'
  },
  {
    id: 'gingerbread-house', name: 'Gingerbread House', category: 'holiday',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    description: 'Artisan spiced gingerbread house constructed with royal sugar icing, gumdrop roof tiles, and candy cane columns.',
    priceTag: '$65 / showpiece', tag: 'Holiday Showpiece',
    flavorNotes: ['Molasses & Ginger', 'Crisp Spices', 'Royal Confectioner Icing'], servings: 'Centerpiece display'
  },
  {
    id: 'unicorn-cake', name: 'Unicorn Cake', category: 'cakes',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    description: 'Dreamy pastel multi-colored fantasy cake with hand-modeled golden unicorn horn and pastel rosette mane.',
    priceTag: 'From $85 (7-inch)', tag: 'Celebration Favorite',
    flavorNotes: ['Funfetti Sponge', 'Pastel Rosette Buttercream', 'Hand-Crafted Horn'], servings: '12-16 guests'
  }
];

export const MENU_CATEGORIES = [
  { id: 'all', label: 'All Desserts' },
  { id: 'strawberries', label: 'Chocolate Covered Strawberries' },
  { id: 'cakes', label: 'Custom Cakes' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'treats', label: 'Dessert Trays & Bites' },
  { id: 'holiday', label: 'Special Occasions' },
];

export const CATERING_OCCASIONS = [
  { id: 'custom-cakes', label: 'Custom Cakes', icon: 'Cake' },
  { id: 'events-catering', label: 'Events & Catering', icon: 'Users' },
  { id: 'birthdays', label: 'Birthdays', icon: 'Gift' },
  { id: 'corporate', label: 'Corporate Orders', icon: 'Heart' },
  { id: 'occasions', label: 'Any Occasion', icon: 'PartyPopper' },
];

export const STORE_INFO = {
  name: "Chubby Dips",
  subtitle: "CUSTOM DESSERTS & CATERING",
  city: "Houston, TX",
  address: "1100 Louisiana St., Houston, Texas",
  email: "ChubbyDipsInfo@gmail.com",
  phone: "(713) 555-DIPS",
  leadTime: "3–4 day lead time",
  hours: [
    { days: "Mon – Thurs", time: "10:30am – 2pm" },
    { days: "Fri", time: "10:30am – 1pm" },
    { days: "Sat – Sun", time: "CLOSED" }
  ]
};
