import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LibraryService } from '../../services/library.service';
import { Usuario } from '../../models/usuario.model';
import { Libro } from '../../models/libro.model';
import { Prestamo } from '../../models/prestamo.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {
  currentUser: Usuario | null = null;

  // Modales
  mostrarModalQR: boolean = false;
  mostrarModalDevolucion: boolean = false;
  mostrarModalAyuda: boolean = false;

  // QR del usuario
  qrData: string = '';

  // Devolución manual
  isbnDevolucion: string = '';
  prestamosUsuario: Prestamo[] = [];
  prestamoSeleccionado: Prestamo | null = null;

  // Resultado de escaneo
  mostrarResultado: boolean = false;
  resultadoEscaneo: {
    tipo: 'libro' | 'usuario' | 'error';
    mensaje: string;
    datos?: any;
  } | null = null;

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
        this.cargarPrestamosUsuario();
      }
    });
  }

  cargarPrestamosUsuario(): void {
    if (this.currentUser) {
      this.prestamosUsuario = this.libraryService.getPrestamosActivos(this.currentUser.id);
    }
  }

  // Subir imagen de QR
  subirImagenQR(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.procesarImagenQR(file);
    }
  }

  procesarImagenQR(file: File): void {
    // Simulación de lectura de QR
    // En una implementación real, aquí usarías una librería como jsQR o qr-scanner

    setTimeout(() => {
      // Simular diferentes tipos de QR escaneados
      const tiposQR: Array<{ tipo: string; isbn?: string; dni?: string; titulo?: string }> = [
        { tipo: 'libro', isbn: '978-0307474728', titulo: 'Cien años de soledad' },
        { tipo: 'libro', isbn: '978-8467034091', titulo: 'Fuenteovejuna' },
        { tipo: 'usuario', dni: '12345678' }
      ];

      const qrAleatorio = tiposQR[Math.floor(Math.random() * tiposQR.length)];

      if (qrAleatorio.tipo === 'libro' && qrAleatorio.isbn) {
        this.procesarQRLibro(qrAleatorio.isbn);
      } else if (qrAleatorio.tipo === 'usuario' && qrAleatorio.dni) {
        this.procesarQRUsuario(qrAleatorio.dni);
      }
    }, 1500);

    // Mostrar mensaje de procesamiento
    this.resultadoEscaneo = {
      tipo: 'error',
      mensaje: 'Procesando código QR...'
    };
    this.mostrarResultado = true;
  }

  procesarQRLibro(isbn: string): void {
    const libros = this.libraryService.getLibros();
    const libro = libros.find(l => l.isbn === isbn);

    if (libro) {
      this.resultadoEscaneo = {
        tipo: 'libro',
        mensaje: `Libro escaneado: ${libro.titulo}`,
        datos: libro
      };
      this.mostrarResultado = true;
    } else {
      this.resultadoEscaneo = {
        tipo: 'error',
        mensaje: 'No se encontró el libro en el sistema'
      };
      this.mostrarResultado = true;
    }
  }

  procesarQRUsuario(dni: string): void {
    this.resultadoEscaneo = {
      tipo: 'usuario',
      mensaje: `Usuario identificado: DNI ${dni}`,
      datos: { dni }
    };
    this.mostrarResultado = true;
  }

  // Generar QR de identificación
  generarQRIdentificacion(): void {
    if (this.currentUser) {
      this.qrData = `SMARTLIB-USER-${this.currentUser.dni}-${this.currentUser.id}`;
      this.mostrarModalQR = true;
    }
  }

  cerrarModalQR(): void {
    this.mostrarModalQR = false;
  }

  // Devolución manual
  abrirDevolucionManual(): void {
    this.mostrarModalDevolucion = true;
    this.cargarPrestamosUsuario();
  }

  cerrarModalDevolucion(): void {
    this.mostrarModalDevolucion = false;
    this.isbnDevolucion = '';
    this.prestamoSeleccionado = null;
  }

  buscarPrestamoISBN(): void {
    if (!this.isbnDevolucion.trim()) {
      alert('Por favor ingresa un ISBN');
      return;
    }

    const libros = this.libraryService.getLibros();
    const libro = libros.find(l => l.isbn === this.isbnDevolucion);

    if (!libro) {
      alert('No se encontró un libro con ese ISBN');
      return;
    }

    const prestamo = this.prestamosUsuario.find(p => p.libroId === libro.id);

    if (!prestamo) {
      alert('No tienes un préstamo activo de este libro');
      return;
    }

    this.prestamoSeleccionado = prestamo;
  }

  confirmarDevolucion(): void {
    if (!this.prestamoSeleccionado) {
      alert('No hay un préstamo seleccionado');
      return;
    }

    const exito = this.libraryService.devolverLibro(this.prestamoSeleccionado.id);

    if (exito) {
      alert(`¡Devolución registrada exitosamente!

Libro: ${this.prestamoSeleccionado.libro?.titulo}
Fecha de devolución: ${new Date().toLocaleDateString()}

¡Gracias por usar SmartLibrary!`);

      this.cerrarModalDevolucion();
      this.cargarPrestamosUsuario();
    } else {
      alert('No se pudo registrar la devolución. Intenta nuevamente.');
    }
  }

  seleccionarPrestamo(prestamo: Prestamo): void {
    this.prestamoSeleccionado = prestamo;
    this.isbnDevolucion = prestamo.libro?.isbn || '';
  }

  // Ayuda y soporte
  abrirAyuda(): void {
    this.mostrarModalAyuda = true;
  }

  cerrarModalAyuda(): void {
    this.mostrarModalAyuda = false;
  }

  verDetalleLibro(libro: Libro): void {
    this.router.navigate(['/libro', libro.id]);
  }

  reservarLibro(libro: Libro): void {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para reservar libros');
      return;
    }

    if (!libro.disponible) {
      alert('Este libro no está disponible en este momento');
      return;
    }

    const exito = this.libraryService.prestarLibro(libro.id, this.currentUser.id);

    if (exito) {
      alert(`¡Has reservado "${libro.titulo}" exitosamente!`);
      this.cerrarResultado();
    } else {
      alert('No se pudo realizar la reserva. Intenta nuevamente.');
    }
  }

  cerrarResultado(): void {
    this.mostrarResultado = false;
    this.resultadoEscaneo = null;
  }

  formatearFecha(fecha: Date): string {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
}
