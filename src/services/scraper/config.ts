export const UPIICSA_BASE_URL = 'https://www.upiicsa.ipn.mx';

export const ALLOWED_DOMAINS = [
  'www.upiicsa.ipn.mx',
  'upiicsa.ipn.mx'
];

export const SCRAPING_RULES = {
  maxDepth: 10,
  excludePatterns: [
    /\.(jpg|jpeg|png|gif|ico|css|js)$/i,
    /\?/,
    /#/,
    /mailto:/,
    /tel:/,
    /login/,
    /admin/,
    /wp-/
  ],
  includePatterns: [
    /^https?:\/\/(www\.)?upiicsa\.ipn\.mx/,
    /servicio-social/,
    /estudiantes/,
    /electivas/,
    /academica/,
    /titulacion/,
    /practicas/,
    /tramites/,
    /carreras/,
    /informatica/,
    /industrial/,
    /transporte/,
    /metalurgia/,
    /energia/
  ]
};

export const SELECTORS = {
  title: 'title, h1, .page-title',
  content: 'p, h1, h2, h3, h4, h5, h6, li, article, .content, .main-content, .entry-content, .post-content',
  links: 'a[href]',
  menu: 'nav a, .menu a, .navbar a, .navigation a'
};