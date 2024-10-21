import { MenuListElement } from './menu-list-element';

export interface MenuList {
  label: string;
  menu: MenuListElement[];
}

export const MENUS_LIST: MenuList[] = [
  {
    label: 'Products',
    menu: [
      {
        label: 'Exchange',
        routerLink: '/exchange'
      },
      {
        label: 'Buy Crypto',
        routerLink: '/buy-crypto'
      },
      {
        label: 'Sell Crypto',
        routerLink: '/sell-crypto'
      },
      {
        label: 'Bridge',
        routerLink: '/cross-chain'
      },
      {
        label: 'Crypto Loans',
        routerLink: '/crypto-loans'
      },
      {
        label: 'Spend Crypto',
        routerLink: '/spend-crypto'
      }
    ]
  },
  {
    label: 'Business',
    menu: [
      {
        label: 'Exchange Listing',
        routerLink: '/exchange-listing'
      },
      {
        label: 'Affiliate Program',
        routerLink: '/affiliate'
      },
      {
        label: 'API',
        routerLink: '/api'
      }
    ]
  },
  {
    label: 'Support',
    menu: [
      {
        label: 'How it works',
        routerLink: '/how-it-works'
      },
      {
        label: 'FAQ',
        routerLink: '/faq'
      },
      {
        label: 'Contact Support',
        routerLink: '',
        href: 'mailto:support@swapspace.co'
      }
    ]
  },
  {
    label: 'About',
    menu: [
      {
        label: 'About us',
        routerLink: '/about'
      },
      {
        label: 'News',
        routerLink: '/news'
      },
      {
        label: 'Press About Us',
        routerLink: '/press-about-us'
      },
      {
        label: 'Our Partners',
        routerLink: '/partners'
      },
      {
        label: 'Contacts',
        routerLink: '/contacts'
      },
      {
        label: 'Exchange Reviews',
        routerLink: '/reviews'
      },
      {
        label: 'Success Stories',
        routerLink: '/success-stories'
      }
    ]
  },
  {
    label: 'Explore',
    menu: [
      {
        label: 'Blog',
        routerLink: '/blog'
      },
      {
        label: 'Academy',
        routerLink: '/academy'
      },
      {
        label: 'Price Predictions',
        routerLink: '/price-predictions'
      },
      {
        label: 'Profit Calculator',
        routerLink: '/crypto-profit-calculator'
      },
      {
        label: 'Invaders Club',
        routerLink: '/invaders'
      }
    ]
  }
];
