export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  editorial: string;
  anioPublicacion: number;
  disponible: boolean;
  copias: number;
  copiasDisponibles: number;
  portada?: string;
  descripcion?: string;
  paginas?: number;
  rating?: number;
  sinopsis?: string;
  ubicacion?: string;
}
