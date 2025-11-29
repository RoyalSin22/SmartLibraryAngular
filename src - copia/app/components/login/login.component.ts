import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const dni = this.loginForm.value.dni;
      const user = this.userService.login(dni);

      if (user) {
        console.log('Login exitoso:', user);
        this.router.navigate(['/catalogo']);
      } else {
        this.errorMessage = 'DNI no encontrado. Intenta con: 12345678, 87654321, o 11223344';
      }
    }
  }

  onRegisterClick() {
    alert('Funcionalidad de bibliotecario en desarrollo');
  }
}
