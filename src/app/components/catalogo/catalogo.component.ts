import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { UserService } from '../../services/user.service';
import { Libro } from '../../models/libro.model';
import { Usuario } from '../../models/usuario.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    RouterModule
  ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  currentUser: Usuario | null = null;

  categorias: string[] = [
    'Todos',
    'Épico',
    'Narrativa',
    'Dramático',
    'Sci-Fi',
    'Poesía',
    'Infantil',
    'Ensayo',
    'Histórico'
  ];

  noticias = [
    {
      tag: '¡NUEVO!',
      tagClass: 'new-tag',
      highlight: true,
      titulo: 'Cambio de Normas de Préstamo',
      fecha: '25 de Noviembre',
      resumen: 'El límite de libros por usuario ha cambiado de 3 a 5. ¡Aprovéchalo!'
    },
    {
      tag: 'Importante',
      tagClass: 'important-tag',
      highlight: false,
      titulo: 'Mantenimiento del Sistema',
      fecha: '28 de Noviembre (22:00-00:00)',
      resumen: 'El sistema estará inactivo por mantenimiento programado.'
    },
    {
      tag: '',
      tagClass: '',
      highlight: false,
      titulo: 'Club de Lectura "El Quijote"',
      fecha: 'Inscripciones Abiertas',
      resumen: 'Únete a nuestra nueva sesión de discusión literaria.'
    },
    {
      tag: '',
      tagClass: '',
      highlight: false,
      titulo: 'Nuevo Acervo de Historia',
      fecha: '20 de Noviembre',
      resumen: 'Se han añadido 100 títulos nuevos a la sección de Historia.'
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

    this.libraryService.libros$.subscribe(libros => {
      this.libros = libros;
      this.filtrarLibros();
    });
  }

  onSearch(): void {
    this.filtrarLibros();
  }

  selectCategory(categoria: string): void {
    this.selectedCategory = categoria;
    this.filtrarLibros();
  }

  filtrarLibros(): void {
    let resultado = [...this.libros];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      resultado = resultado.filter(libro =>
        libro.titulo.toLowerCase().includes(term) ||
        libro.autor.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory !== 'Todos') {
      resultado = resultado.filter(libro =>
        libro.categoria === this.selectedCategory
      );
    }

    this.librosFiltrados = resultado;
  }

  verDetalle(id: string): void {
    this.router.navigate(['/libro', id]);
  }

  getPortada(libro: Libro): string {
    return libro.portada || '/src/assets/images/';
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
}
