import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Libro } from '../models/libro.model';
import { Prestamo } from '../models/prestamo.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private librosSubject = new BehaviorSubject<Libro[]>(this.getLibrosIniciales());
  public libros$ = this.librosSubject.asObservable();

  private prestamosSubject = new BehaviorSubject<Prestamo[]>(this.getPrestamosIniciales());
  public prestamos$ = this.prestamosSubject.asObservable();

  constructor() {
    const storedLibros = localStorage.getItem('libros');
    if (storedLibros) {
      this.librosSubject.next(JSON.parse(storedLibros));
    } else {
      this.guardarLibrosEnLocalStorage();
    }

    const storedPrestamos = localStorage.getItem('prestamos');
    if (storedPrestamos) {
      const prestamos = JSON.parse(storedPrestamos);
      prestamos.forEach((p: any) => {
        p.fechaPrestamo = new Date(p.fechaPrestamo);
        p.fechaDevolucion = new Date(p.fechaDevolucion);
        if (p.fechaDevolucionReal) {
          p.fechaDevolucionReal = new Date(p.fechaDevolucionReal);
        }
      });
      this.prestamosSubject.next(prestamos);
    } else {
      this.guardarPrestamosEnLocalStorage();
    }
  }

  private getLibrosIniciales(): Libro[] {
  return [
    {
      id: '1',
      titulo: 'Paco Yunque',
      autor: 'César Vallejo',
      isbn: '978-6124191053',
      categoria: 'Narrativa',
      editorial: 'Peisa',
      anioPublicacion: 1931,
      disponible: true,
      copias: 3,
      copiasDisponibles: 2,
      portada: 'assets/images/paco_yunque.png',
      descripcion: 'Cuento sobre las diferencias sociales en la escuela',
      paginas: 48,
      rating: 4,
      sinopsis: 'Paco Yunque es un niño que llega nuevo a la escuela.',
      ubicacion: 'Estante A-12'
    },
    {
      id: '2',
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      isbn: '978-0307474728',
      categoria: 'Narrativa',
      editorial: 'Diana',
      anioPublicacion: 1967,
      disponible: true,
      copias: 5,
      copiasDisponibles: 3,
      portada: 'assets/images/cien_anos_soledad.png',
      descripcion: 'Una obra maestra de la literatura latinoamericana',
      paginas: 432,
      rating: 4.5,
      sinopsis: 'La historia de siete generaciones de la familia Buendía.',
      ubicacion: 'Estante B-05'
    },
    {
      id: '3',
      titulo: 'Fuenteovejuna',
      autor: 'Félix Lope de Vega',
      isbn: '978-8467034091',
      categoria: 'Dramático',
      editorial: 'Espasa',
      anioPublicacion: 1619,
      disponible: true,
      copias: 4,
      copiasDisponibles: 2,
      portada: 'assets/images/fuenteovejuna.jpg',
      descripcion: 'Drama histórico del Siglo de Oro español',
      paginas: 120,
      rating: 4,
      sinopsis: 'Drama que narra la rebelión del pueblo de Fuenteovejuna.',
      ubicacion: 'Estante C-08'
    },
    {
      id: '4',
      titulo: '20 mil leguas de viaje submarino',
      autor: 'Jules Verne',
      isbn: '978-8420412146',
      categoria: 'Sci-Fi',
      editorial: 'Alfaguara',
      anioPublicacion: 1870,
      disponible: true,
      copias: 3,
      copiasDisponibles: 3,
      portada: 'assets/images/20_mil_leguas.jpg',
      descripcion: 'Aventura submarina de ciencia ficción',
      paginas: 424,
      rating: 5,
      sinopsis: 'Las aventuras del Capitán Nemo y su submarino Nautilus.',
      ubicacion: 'Estante D-15'
    },
    {
      id: '5',
      titulo: 'El Amor en los Tiempos del Cólera',
      autor: 'Gabriel García Márquez',
      isbn: '978-0307387387',
      categoria: 'Narrativa',
      editorial: 'Diana',
      anioPublicacion: 1985,
      disponible: true,
      copias: 4,
      copiasDisponibles: 1,
      portada: 'assets/images/amor_tiempos_colera.jpg',
      descripcion: 'Historia de amor que trasciende el tiempo',
      paginas: 368,
      rating: 4,
      sinopsis: 'Una historia de amor que atraviesa más de cincuenta años.',
      ubicacion: 'Estante B-07'
    },
    {
      id: '6',
      titulo: 'La Metamorfosis',
      autor: 'Franz Kafka',
      isbn: '978-8420674704',
      categoria: 'Narrativa',
      editorial: 'Alianza Editorial',
      anioPublicacion: 1915,
      disponible: true,
      copias: 3,
      copiasDisponibles: 2,
      portada: 'assets/images/metamorfosis.jpg',
      descripcion: 'Relato sobre la transformación y alienación',
      paginas: 96,
      rating: 4,
      sinopsis: 'La historia de Gregor Samsa, quien despierta convertido en insecto.',
      ubicacion: 'Estante E-03'
    },
    {
      id: '7',
      titulo: 'Odisea',
      autor: 'Homero',
      isbn: '978-8420674148',
      categoria: 'Épico',
      editorial: 'Alianza Editorial',
      anioPublicacion: -800,
      disponible: true,
      copias: 5,
      copiasDisponibles: 4,
      portada: 'assets/images/odisea.jpg',
      descripcion: 'Epopeya griega clásica sobre el viaje de Odiseo',
      paginas: 560,
      rating: 5,
      sinopsis: 'El épico viaje de Odiseo de regreso a Ítaca.',
      ubicacion: 'Estante F-01'
    },
    {
      id: '8',
      titulo: 'Cuentos de Barro',
      autor: 'Salarrué',
      isbn: '978-9992353479',
      categoria: 'Narrativa',
      editorial: 'UCA Editores',
      anioPublicacion: 1933,
      disponible: true,
      copias: 2,
      copiasDisponibles: 1,
      portada: 'assets/images/cuentos_barro.jpg',
      descripcion: 'Cuentos salvadoreños sobre la vida rural',
      paginas: 156,
      rating: 4,
      sinopsis: 'Colección de cuentos que retratan la vida campesina.',
      ubicacion: 'Estante A-20'
    },
    {
      id: '9',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      isbn: '978-8420412146',
      categoria: 'Épico',
      editorial: 'Alfaguara',
      anioPublicacion: 1605,
      disponible: false,
      copias: 5,
      copiasDisponibles: 0,
      portada: 'assets/images/don_quijote.png',
      descripcion: 'La novela más importante de la literatura española',
      paginas: 1200,
      rating: 5,
      sinopsis: 'Las aventuras del ingenioso hidalgo Don Quijote.',
      ubicacion: 'Estante F-10'
    },
    {
      id: '10',
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      isbn: '978-0156012195',
      categoria: 'Infantil',
      editorial: 'Salamandra',
      anioPublicacion: 1943,
      disponible: false,
      copias: 2,
      copiasDisponibles: 0,
      portada: 'assets/images/el_principito.jpg',
      descripcion: 'Un cuento filosófico y poético',
      paginas: 96,
      rating: 5,
      sinopsis: 'La historia de un pequeño príncipe que viaja de planeta en planeta.',
      ubicacion: 'Estante G-05'
    }
  ];
}

  private getPrestamosIniciales(): Prestamo[] {
    const now = new Date();
    return [
      {
        id: '1',
        libroId: '1',
        usuarioId: '1',
        fechaPrestamo: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        fechaDevolucion: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
        estado: 'activo',
        renovaciones: 0,
        maxRenovaciones: 2
      },
      {
        id: '2',
        libroId: '5',
        usuarioId: '1',
        fechaPrestamo: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        fechaDevolucion: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        estado: 'activo',
        renovaciones: 1,
        maxRenovaciones: 2
      },
      {
        id: '3',
        libroId: '9',
        usuarioId: '3',
        fechaPrestamo: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        fechaDevolucion: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        estado: 'activo',
        renovaciones: 0,
        maxRenovaciones: 2
      }
    ];
  }

  getLibros(): Libro[] {
    return this.librosSubject.value;
  }

  getLibroById(id: string): Libro | undefined {
    return this.librosSubject.value.find(l => l.id === id);
  }

  buscarLibros(termino: string): Libro[] {
    const libros = this.librosSubject.value;
    if (!termino.trim()) {
      return libros;
    }
    termino = termino.toLowerCase();
    return libros.filter(libro =>
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino) ||
      libro.categoria.toLowerCase().includes(termino) ||
      libro.isbn.toLowerCase().includes(termino)
    );
  }

  prestarLibro(libroId: string, usuarioId: string): boolean {
    const libros = this.librosSubject.value;
    const libro = libros.find(l => l.id === libroId);

    if (libro && libro.copiasDisponibles > 0) {
      libro.copiasDisponibles--;
      libro.disponible = libro.copiasDisponibles > 0;

      const nuevoPrestamo: Prestamo = {
        id: Date.now().toString(),
        libroId: libroId,
        usuarioId: usuarioId,
        fechaPrestamo: new Date(),
        fechaDevolucion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estado: 'activo',
        renovaciones: 0,
        maxRenovaciones: 2
      };

      const prestamos = this.prestamosSubject.value;
      prestamos.push(nuevoPrestamo);

      this.librosSubject.next(libros);
      this.prestamosSubject.next(prestamos);

      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  devolverLibro(prestamoId: string): boolean {
    const prestamos = this.prestamosSubject.value;
    const prestamo = prestamos.find(p => p.id === prestamoId);

    if (prestamo && prestamo.estado === 'activo') {
      prestamo.estado = 'devuelto';
      prestamo.fechaDevolucionReal = new Date();

      const libros = this.librosSubject.value;
      const libro = libros.find(l => l.id === prestamo.libroId);

      if (libro) {
        libro.copiasDisponibles++;
        libro.disponible = true;
      }

      this.librosSubject.next(libros);
      this.prestamosSubject.next(prestamos);

      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  renovarPrestamo(prestamoId: string): boolean {
    const prestamos = this.prestamosSubject.value;
    const prestamo = prestamos.find(p => p.id === prestamoId);

    if (prestamo && prestamo.estado === 'activo' && prestamo.renovaciones < prestamo.maxRenovaciones) {
      prestamo.renovaciones++;
      prestamo.fechaDevolucion = new Date(prestamo.fechaDevolucion.getTime() + 7 * 24 * 60 * 60 * 1000);
      prestamo.estado = 'renovado';

      this.prestamosSubject.next(prestamos);
      this.guardarPrestamosEnLocalStorage();
      return true;
    }
    return false;
  }

  getPrestamosUsuario(usuarioId: string): Prestamo[] {
    const prestamos = this.prestamosSubject.value;
    const libros = this.librosSubject.value;

    return prestamos
      .filter(p => p.usuarioId === usuarioId)
      .map(p => ({
        ...p,
        libro: libros.find(l => l.id === p.libroId)
      }));
  }

  getPrestamosActivos(usuarioId: string): Prestamo[] {
    return this.getPrestamosUsuario(usuarioId).filter(p => p.estado === 'activo' || p.estado === 'renovado');
  }

  getHistorialPrestamos(usuarioId: string): Prestamo[] {
    return this.getPrestamosUsuario(usuarioId).filter(p => p.estado === 'devuelto');
  }

  private guardarEnLocalStorage(): void {
    this.guardarLibrosEnLocalStorage();
    this.guardarPrestamosEnLocalStorage();
  }

  private guardarLibrosEnLocalStorage(): void {
    localStorage.setItem('libros', JSON.stringify(this.librosSubject.value));
  }

  private guardarPrestamosEnLocalStorage(): void {
    localStorage.setItem('prestamos', JSON.stringify(this.prestamosSubject.value));
  }
}
