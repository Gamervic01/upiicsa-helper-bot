export const UPIICSA_BASE_URL = 'https://www.upiicsa.ipn.mx';

export const ALLOWED_DOMAINS = [
  'www.upiicsa.ipn.mx',
  'upiicsa.ipn.mx'
];

export const SCRAPING_RULES = {
  maxDepth: 5,
  excludePatterns: [
    /\.(jpg|jpeg|png|gif|ico|css|js)$/i,
    /\?/,
    /#/,
    /mailto:/,
    /tel:/
  ],
  includePatterns: [
    /^https?:\/\/(www\.)?upiicsa\.ipn\.mx/,
    /servicio-social/,
    /estudiantes/,
    /electivas/,
    /academica/
  ]
};

export const SELECTORS = {
  title: 'title',
  content: 'p, h1, h2, h3, h4, h5, h6, li, .content, .main-content, article',
  links: 'a',
  menu: 'nav a, .menu a, .navbar a'
};