import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  // Datos de ejemplo - usuarios de prueba
  private usuarios: Usuario[] = [
    {
      id: '1',
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Pérez García',
      email: 'juan.perez@example.com',
      telefono: '987654321',
      direccion: 'Av. Principal 123, Lima',
      fechaRegistro: new Date('2024-01-15'),
      tipo: 'estudiante',
      prestamosActivos: 2,
      historialPrestamos: 15
    },
    {
      id: '2',
      dni: '87654321',
      nombre: 'María',
      apellido: 'González López',
      email: 'maria.gonzalez@example.com',
      telefono: '912345678',
      direccion: 'Jr. Los Álamos 456, Lima',
      fechaRegistro: new Date('2023-06-20'),
      tipo: 'bibliotecario',
      prestamosActivos: 0,
      historialPrestamos: 0
    },
    {
      id: '3',
      dni: '11223344',
      nombre: 'Carlos',
      apellido: 'Ramírez Silva',
      email: 'carlos.ramirez@example.com',
      telefono: '998877665',
      direccion: 'Calle Las Flores 789, Lima',
      fechaRegistro: new Date('2024-03-10'),
      tipo: 'profesor',
      prestamosActivos: 1,
      historialPrestamos: 8
    }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(dni: string): Usuario | null {
    const user = this.usuarios.find(u => u.dni === dni);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  updateUser(userData: Partial<Usuario>): void {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      const index = this.usuarios.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        this.usuarios[index] = updatedUser;
      }
    }
  }

  getAllUsers(): Usuario[] {
    return this.usuarios;
  }

  getUserById(id: string): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }
}
