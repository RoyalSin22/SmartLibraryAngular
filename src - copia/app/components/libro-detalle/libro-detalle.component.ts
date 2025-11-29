import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { UserService } from '../../services/user.service';
import { Libro } from '../../models/libro.model';
import { Usuario } from '../../models/usuario.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './libro-detalle.component.html',
  styleUrls: ['./libro-detalle.component.css']
})
export class LibroDetalleComponent implements OnInit {
  libro: Libro | null = null;
  recomendaciones: Libro[] = [];
  currentUser: Usuario | null = null;
  libroId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del libro desde la URL
    this.route.params.subscribe(params => {
      this.libroId = params['id'];
      this.cargarLibro();
      this.cargarRecomendaciones();
    });

    // Obtener usuario actual
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  cargarLibro(): void {
    const libros = this.libraryService.getLibros();
    this.libro = libros.find(l => l.id === this.libroId) || null;

    if (!this.libro) {
      // Si no se encuentra el libro, redirigir al catálogo
      this.router.navigate(['/catalogo']);
    }
  }

  cargarRecomendaciones(): void {
    const libros = this.libraryService.getLibros();

    // Filtrar libros de la misma categoría (excepto el actual)
    if (this.libro) {
      this.recomendaciones = libros
        .filter(l => l.categoria === this.libro!.categoria && l.id !== this.libro!.id)
        .slice(0, 5);
    }
  }

  reservarLibro(): void {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para reservar libros');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.libro || !this.libro.disponible) {
      alert('Este libro no está disponible en este momento');
      return;
    }

    const exito = this.libraryService.prestarLibro(this.libro.id, this.currentUser.id);

    if (exito) {
      alert(`¡Has reservado "${this.libro.titulo}" exitosamente!`);
      this.cargarLibro(); // Recargar para actualizar disponibilidad
    } else {
      alert('No se pudo realizar la reserva. Intenta nuevamente.');
    }
  }

  compartir(): void {
    if (this.libro) {
      const url = window.location.href;
      const texto = `Mira este libro: ${this.libro.titulo} por ${this.libro.autor}`;

      if (navigator.share) {
        navigator.share({
          title: this.libro.titulo,
          text: texto,
          url: url
        }).catch(err => console.log('Error al compartir:', err));
      } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles');
      }
    }
  }

  anadirALista(): void {
    alert('Funcionalidad de lista de deseos en desarrollo');
  }

  dejarOpinion(): void {
    alert('Funcionalidad de opiniones en desarrollo');
  }

  volverCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  verDetalle(libroId: string): void {
    this.router.navigate(['/libro', libroId]);
  }

  getStars(rating: number): any[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'full' });
    }

    if (hasHalfStar) {
      stars.push({ type: 'half' });
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push({ type: 'empty' });
    }

    return stars;
  }
}
