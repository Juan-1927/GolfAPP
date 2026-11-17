import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { PalosService } from '../../Services/palos';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-palos-form',
  templateUrl: './palos-form.component.html',
  styleUrl: './palos-form.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class PalosFormComponent implements OnInit {
  private id: string | null;
  readonly esEdicion: boolean;

  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  paloForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    marca: new FormControl('', Validators.required),
    tipo: new FormControl('Driver', Validators.required),
    material: new FormControl('Grafito', Validators.required),
    flexibilidad: new FormControl('Regular', Validators.required),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  constructor(
    private palosService: PalosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Si la URL trae un id (/formulario/5) es una edicion; si no, es un palo nuevo.
    this.id = this.route.snapshot.paramMap.get('id');
    this.esEdicion = this.id !== null;
  }

  ngOnInit(): void {
    if (!this.esEdicion) {
      return;
    }

    this.cargando.set(true);

    this.palosService.getPalosById(Number(this.id)).subscribe({
      next: (palo) => {
        this.paloForm.patchValue(palo);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el palo:', error);
        this.error.set(mensajeDeError(error, 'No se pudo cargar el palo.'));
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.paloForm.invalid || this.guardando() || this.cargando()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const peticion = this.esEdicion
      ? this.palosService.actualizarPalo(Number(this.id), this.paloForm.value)
      : this.palosService.crearPalo(this.paloForm.value);

    peticion.subscribe({
      next: () => {
        this.router.navigate(['/tabla']);
      },
      error: (error) => {
        console.error('Error al guardar el palo:', error);
        this.error.set(mensajeDeError(error, 'No se pudo guardar el palo.'));
        this.guardando.set(false);
      }
    });
  }
}
