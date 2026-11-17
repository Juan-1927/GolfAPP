import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EquiposService } from '../../Services/equipos';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-equipos-form',
  templateUrl: './equipos-form.component.html',
  styleUrl: '../palos-form/palos-form.component.css',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule, RouterLink]
})
export class EquiposFormComponent implements OnInit {
  private id: string | null;
  readonly esEdicion: boolean;

  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  equipoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    marca: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  constructor(
    private equiposService: EquiposService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Si la URL trae un id (/equipos/formulario/5) es una edicion; si no, es un equipo nuevo.
    this.id = this.route.snapshot.paramMap.get('id');
    this.esEdicion = this.id !== null;
  }

  ngOnInit(): void {
    if (!this.esEdicion) {
      return;
    }

    this.cargando.set(true);

    this.equiposService.getEquipoById(Number(this.id)).subscribe({
      next: (equipo) => {
        this.equipoForm.patchValue(equipo);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el equipo:', error);
        this.error.set(mensajeDeError(error, 'No se pudo cargar el equipo.'));
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.equipoForm.invalid || this.guardando() || this.cargando()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const peticion = this.esEdicion
      ? this.equiposService.actualizarEquipo(Number(this.id), this.equipoForm.value)
      : this.equiposService.crearEquipo(this.equipoForm.value);

    peticion.subscribe({
      next: () => {
        this.router.navigate(['/equipos']);
      },
      error: (error) => {
        console.error('Error al guardar el equipo:', error);
        this.error.set(mensajeDeError(error, 'No se pudo guardar el equipo.'));
        this.guardando.set(false);
      }
    });
  }
}
