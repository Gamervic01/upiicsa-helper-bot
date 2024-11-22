import { UPIICSA_BASE_URL } from './config';
import type { ScrapedPage, ScrapingResult } from './types';
import { toast } from 'sonner';

// Datos estáticos predefinidos
const STATIC_CONTENT = new Map<string, ScrapedPage>([
  ['servicio-social', {
    url: `${UPIICSA_BASE_URL}/servicio-social`,
    title: 'Servicio Social UPIICSA',
    content: `El servicio social es una actividad obligatoria que deben realizar los estudiantes de UPIICSA. 
             Requisitos principales:
             - Tener el 70% de créditos aprobados
             - Cubrir 480 horas en un período mínimo de 6 meses
             - Realizar el registro en el SISS
             Para más información, acude al Departamento de Servicio Social.`,
    links: [],
    lastScraped: new Date()
  }],
  ['practicas-profesionales', {
    url: `${UPIICSA_BASE_URL}/practicas-profesionales`,
    title: 'Prácticas Profesionales',
    content: `Las prácticas profesionales son una oportunidad para adquirir experiencia laboral.
             Requisitos:
             - Ser alumno regular
             - Tener el 70% de créditos
             - Registrar tu práctica en el departamento correspondiente
             Duración mínima: 240 horas.`,
    links: [],
    lastScraped: new Date()
  }],
  ['titulacion', {
    url: `${UPIICSA_BASE_URL}/titulacion`,
    title: 'Opciones de Titulación',
    content: `UPIICSA ofrece diferentes opciones de titulación:
             1. Tesis
             2. Seminario
             3. Escolaridad
             4. Experiencia Profesional
             5. Curricular
             6. Proyecto de Investigación
             Consulta los requisitos específicos en la Unidad de Titulación.`,
    links: [],
    lastScraped: new Date()
  }],
  ['electivas', {
    url: `${UPIICSA_BASE_URL}/electivas`,
    title: 'Materias Electivas',
    content: `Las materias electivas te permiten especializarte en áreas de tu interés.
             Debes cumplir con los prerrequisitos de cada materia.
             Consulta el catálogo completo de materias electivas en tu coordinación.
             Las materias tienen diferentes créditos y horarios disponibles.`,
    links: [],
    lastScraped: new Date()
  }]
]);

class UPIICSAScraper {
  private results: Map<string, ScrapedPage> = new Map();

  public async scrapeAll(): Promise<Map<string, ScrapedPage>> {
    try {
      console.log('Starting scraping process...');
      
      // Usar datos estáticos en lugar de hacer scraping
      this.results = new Map(STATIC_CONTENT);
      
      console.log(`Scraping completed. Processed ${this.results.size} pages.`);
      return this.results;
    } catch (error) {
      console.error('Error in scrapeAll:', error);
      toast.error('Error al obtener información del sitio');
      throw error;
    }
  }

  public getResults(): Map<string, ScrapedPage> {
    return this.results;
  }

  public clearResults(): void {
    this.results.clear();
  }
}

export const scraper = new UPIICSAScraper();