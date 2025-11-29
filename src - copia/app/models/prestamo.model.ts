import { Libro } from './libro.model';
import { Usuario } from './usuario.model';

export interface Prestamo {
  id: string;
  libroId: string;
  libro?: Libro;
  usuarioId: string;
  usuario?: Usuario;
  fechaPrestamo: Date;
  fechaDevolucion: Date;
  fechaDevolucionReal?: Date;
  estado: 'activo' | 'devuelto' | 'vencido' | 'renovado';
  renovaciones: number;
  maxRenovaciones: number;
  multaPendiente?: number;
}
