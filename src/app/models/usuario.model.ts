export interface Usuario {
  id: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: Date;
  tipo: 'estudiante' | 'bibliotecario' | 'profesor';
  prestamosActivos?: number;
  historialPrestamos?: number;
}
