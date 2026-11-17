import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { VestimentaService } from '../../Services/vestimenta';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-vestimenta-form',
  templateUrl: './vestimenta-form.component.html',
  styleUrl: '../palos-form/palos-form.component.css',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatSelectModule, MatCardModule, ReactiveFormsModule, RouterLink]
})
export class VestimentaFormComponent implements OnInit {
  private id: string | null;
  readonly esEdicion: boolean;

  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  prendaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    marca: new FormControl('', Validators.required),
    talla: new FormControl('M', Validators.required),
    color: new FormControl('', Validators.required),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  constructor(
    private vestimentaService: VestimentaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Si la URL trae un id (/vestimenta/formulario/5) es una edicion; si no, es una prenda nueva.
    this.id = this.route.snapshot.paramMap.get('id');
    this.esEdicion = this.id !== null;
  }

  ngOnInit(): void {
    if (!this.esEdicion) {
      return;
    }

    this.cargando.set(true);

    this.vestimentaService.getPrendaById(Number(this.id)).subscribe({
      next: (prenda) => {
        this.prendaForm.patchValue(prenda);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la prenda:', error);
        this.error.set(mensajeDeError(error, 'No se pudo cargar la prenda.'));
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.prendaForm.invalid || this.guardando() || this.cargando()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const peticion = this.esEdicion
      ? this.vestimentaService.actualizarPrenda(Number(this.id), this.prendaForm.value)
      : this.vestimentaService.crearPrenda(this.prendaForm.value);

    peticion.subscribe({
      next: () => {
        this.router.navigate(['/vestimenta']);
      },
      error: (error) => {
        console.error('Error al guardar la prenda:', error);
        this.error.set(mensajeDeError(error, 'No se pudo guardar la prenda.'));
        this.guardando.set(false);
      }
    });
  }
}
