import { Component } from '@angular/core';
import type { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { LoginService } from '../../Services/login';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    contrasena: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService, private router: Router) {}

  registrar(): void {
    if (this.registroForm.invalid) {
      return;
    }

    this.loginService.registrar({
      usuario: this.registroForm.controls.usuario.value ?? '',
      contrasena: this.registroForm.controls.contrasena.value ?? ''
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro correcto',
          text: 'Ya puedes iniciar sesión.'
        });
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar',
          text: error.status === 409
            ? 'Ese usuario ya está registrado.'
            : 'Revisa los datos e inténtalo de nuevo.'
        });
      }
    });
  }
}
