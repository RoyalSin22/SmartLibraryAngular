import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { UserService } from '../../services/user.service';
import { Libro } from '../../models/libro.model';
import { Usuario } from '../../models/usuario.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: Usuario | null = null;
  librosDestacados: Libro[] = [];
  librosRecientes: Libro[] = [];

  // Estadísticas
  totalLibros: number = 0;
  totalUsuarios: number = 0;
  prestamosActivos: number = 0;

  categorias = [
    { nombre: 'Narrativa', icono: 'fas fa-book', color: '#3498db' },
    { nombre: 'Sci-Fi', icono: 'fas fa-rocket', color: '#9b59b6' },
    { nombre: 'Histórico', icono: 'fas fa-landmark', color: '#e67e22' },
    { nombre: 'Poesía', icono: 'fas fa-feather-alt', color: '#e91e63' },
    { nombre: 'Infantil', icono: 'fas fa-child', color: '#2ecc71' },
    { nombre: 'Ensayo', icono: 'fas fa-scroll', color: '#34495e' }
  ];

  noticias = [
    {
      id: 1,
      titulo: 'Nuevos títulos disponibles',
      fecha: new Date('2025-11-25'),
      resumen: 'Hemos incorporado más de 50 nuevos títulos a nuestra colección de literatura latinoamericana.',
      imagen: 'assets/img/news-books.jpg',
      destacado: true
    },
    {
      id: 2,
      titulo: 'Horario extendido en exámenes',
      fecha: new Date('2025-11-20'),
      resumen: 'Durante el período de exámenes, la biblioteca estará abierta hasta las 22:00 hrs.',
      imagen: 'assets/img/news-schedule.jpg',
      destacado: false
    },
    {
      id: 3,
      titulo: 'Taller de escritura creativa',
      fecha: new Date('2025-11-18'),
      resumen: 'Inscríbete en nuestro taller gratuito de escritura creativa. Cupos limitados.',
      imagen: 'assets/img/news-workshop.jpg',
      destacado: false
    }
  ];

  constructor(
    private libraryService: LibraryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar libros destacados
    this.libraryService.libros$.subscribe(libros => {
      this.totalLibros = libros.length;

      // Libros destacados (los mejor calificados)
      this.librosDestacados = [...libros]
        .filter(libro => libro.rating !== undefined)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);

      // Libros recientes (últimos agregados)
      this.librosRecientes = [...libros].slice(-4).reverse();
    });

    // Estadísticas simuladas (en producción vendrían del backend)
    this.totalUsuarios = 1250;
    this.prestamosActivos = 342;
  }

  verLibro(id: string): void {
    this.router.navigate(['/libro', id]);
  }

  verCategoria(categoria: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { categoria } });
  }

  explorarCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  getStars(rating?: number): string[] {
    const r = rating ?? 0;
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (r >= i + 1) {
        stars.push('full');
      } else if (r > i) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
