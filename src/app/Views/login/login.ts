import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { LoginService } from '../../Services/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // El usuario y la contraseña empiezan vacíos.
  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    contrasena: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService, private router: Router) {}

  ingresar(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // El formulario es válido: se imprimen sus campos en la consola.
    console.log(this.loginForm.controls);

    this.loginService.login(this.loginForm.value).subscribe({
      next: () => {
        // Guardar el usuario y la contraseña en el localStorage
        localStorage.setItem('usuario', this.loginForm.controls['usuario'].value ?? '');
        localStorage.setItem('contrasena', this.loginForm.controls['contrasena'].value ?? '');

        // Obtener el usuario y la contraseña del localStorage
        console.log('Usuario guardado:', localStorage.getItem('usuario'));
        console.log('Contraseña guardada:', localStorage.getItem('contrasena'));

        Swal.fire({
          icon: 'success',
          title: 'Ingreso correcto',
          text: 'Bienvenido a GolfAPP'
        });

        this.router.navigate(['/palos']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Datos incorrectos',
          text: 'Vuelve a ingresar los datos correctamente.'
        });
      }
    });
  }
}
