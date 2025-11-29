import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { UserService } from '../../services/user.service';
import { Prestamo } from '../../models/prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {
  prestamosActivos: Prestamo[] = [];
  currentUser: Usuario | null = null;
  totalLibros: number = 0;
  librosVencidos: number = 0;
  proximosVencer: number = 0;

  constructor(
    private libraryService: LibraryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cargarPrestamos();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  cargarPrestamos(): void {
    if (this.currentUser) {
      this.prestamosActivos = this.libraryService.getPrestamosActivos(this.currentUser.id);
      this.calcularEstadisticas();
    }
  }

  calcularEstadisticas(): void {
    this.totalLibros = this.prestamosActivos.length;
    this.librosVencidos = 0;
    this.proximosVencer = 0;

    const hoy = new Date();
    const tresDias = new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000);

    this.prestamosActivos.forEach(prestamo => {
      const fechaVencimiento = new Date(prestamo.fechaDevolucion);

      if (fechaVencimiento < hoy) {
        this.librosVencidos++;
      } else if (fechaVencimiento <= tresDias) {
        this.proximosVencer++;
      }
    });
  }

  getEstadoPrestamo(prestamo: Prestamo): string {
    const hoy = new Date();
    const fechaVencimiento = new Date(prestamo.fechaDevolucion);
    const tresDias = new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (fechaVencimiento < hoy) {
      return 'vencido';
    } else if (fechaVencimiento <= tresDias) {
      return 'proximo-vencer';
    } else {
      return 'activo';
    }
  }

  getEstadoClase(prestamo: Prestamo): string {
    const estado = this.getEstadoPrestamo(prestamo);
    switch (estado) {
      case 'vencido': return 'status-danger';
      case 'proximo-vencer': return 'status-warning';
      default: return 'status-success';
    }
  }

  getEstadoTexto(prestamo: Prestamo): string {
    const estado = this.getEstadoPrestamo(prestamo);
    switch (estado) {
      case 'vencido': return 'Vencido';
      case 'proximo-vencer': return 'Por Vencer';
      default: return 'Activo';
    }
  }

  getEstadoTagClase(prestamo: Prestamo): string {
    const estado = this.getEstadoPrestamo(prestamo);
    switch (estado) {
      case 'vencido': return 'tag-danger';
      case 'proximo-vencer': return 'tag-warning';
      default: return 'tag-success';
    }
  }

  renovarPrestamo(prestamo: Prestamo): void {
    if (prestamo.renovaciones >= prestamo.maxRenovaciones) {
      alert(`Este libro ya ha alcanzado el número máximo de renovaciones (${prestamo.maxRenovaciones})`);
      return;
    }

    const exito = this.libraryService.renovarPrestamo(prestamo.id);

    if (exito) {
      alert(`¡Préstamo renovado exitosamente! Nueva fecha de devolución: ${this.formatearFecha(prestamo.fechaDevolucion)}`);
      this.cargarPrestamos();
    } else {
      alert('No se pudo renovar el préstamo. Intenta nuevamente.');
    }
  }

  formatearFecha(fecha: Date): string {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  getDiasRestantes(fecha: Date): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(fecha);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diferencia = fechaVencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  verDetalleLibro(libroId: string): void {
    this.router.navigate(['/libro', libroId]);
  }
}
