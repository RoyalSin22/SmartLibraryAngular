import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LibraryService } from '../../services/library.service';
import { Usuario } from '../../models/usuario.model';
import { Prestamo } from '../../models/prestamo.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  currentUser: Usuario | null = null;
  historialPrestamos: Prestamo[] = [];

  // Estados de modales
  mostrarModalEditar: boolean = false;
  mostrarModalQR: boolean = false;
  mostrarModalPassword: boolean = false;

  // Datos editables
  datosEditados: Partial<Usuario> = {};

  // Estadísticas
  totalLeidos: number = 0;
  prestamosActivos: number = 0;
  diasMulta: number = 0;

  // QR
  qrCodeUrl: string = '';

  constructor(
    private userService: UserService,
    private libraryService: LibraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.cargarEstadisticas();
        this.cargarHistorial();
        this.generarQR();
      }
    });
  }

  cargarEstadisticas(): void {
    if (this.currentUser) {
      this.totalLeidos = this.currentUser.historialPrestamos || 0;
      this.prestamosActivos = this.currentUser.prestamosActivos || 0;
      this.diasMulta = 0; // Calcular si tienes lógica de multas
    }
  }

  cargarHistorial(): void {
    if (this.currentUser) {
      this.historialPrestamos = this.libraryService.getPrestamosUsuario(this.currentUser.id).slice(0, 5);
    }
  }

  generarQR(): void {
    if (this.currentUser) {
      // Usar API de QR gratuita
      const qrData = JSON.stringify({
        id: this.currentUser.id,
        nombre: `${this.currentUser.nombre} ${this.currentUser.apellido}`,
        dni: this.currentUser.dni,
        tipo: this.currentUser.tipo
      });
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    }
  }

  abrirModalEditar(): void {
    if (this.currentUser) {
      this.datosEditados = {
        nombre: this.currentUser.nombre,
        apellido: this.currentUser.apellido,
        email: this.currentUser.email,
        telefono: this.currentUser.telefono,
        direccion: this.currentUser.direccion
      };
      this.mostrarModalEditar = true;
    }
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.datosEditados = {};
  }

  guardarCambios(): void {
    if (this.currentUser && this.datosEditados) {
      this.userService.updateUser(this.datosEditados);
      this.cerrarModalEditar();
      alert('¡Información actualizada correctamente!');
    }
  }

  abrirModalQR(): void {
    this.mostrarModalQR = true;
  }

  cerrarModalQR(): void {
    this.mostrarModalQR = false;
  }

  descargarQR(): void {
    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = `QR_${this.currentUser?.nombre}_${this.currentUser?.id}.png`;
    link.click();
  }

  abrirModalPassword(): void {
    this.mostrarModalPassword = true;
  }

  cerrarModalPassword(): void {
    this.mostrarModalPassword = false;
  }

  cambiarPassword(): void {
    // Aquí iría la lógica para cambiar contraseña
    alert('Funcionalidad de cambio de contraseña (implementar con backend)');
    this.cerrarModalPassword();
  }

  cerrarSesion(): void {
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmar) {
      this.userService.logout();
      this.router.navigate(['/login']);
    }
  }

  getAnioRegistro(): string {
    if (this.currentUser?.fechaRegistro) {
      return new Date(this.currentUser.fechaRegistro).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  }

  getTipoUsuarioIcon(): string {
    switch (this.currentUser?.tipo) {
      case 'estudiante': return 'fa-user-graduate';
      case 'profesor': return 'fa-chalkboard-teacher';
      case 'bibliotecario': return 'fa-user-cog';
      default: return 'fa-user';
    }
  }
}
