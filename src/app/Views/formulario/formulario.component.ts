import { Component, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PalosFormComponent } from '../palos-form/palos-form.component';
import { EquiposFormComponent } from '../equipos-form/equipos-form.component';
import { VestimentaFormComponent } from '../vestimenta-form/vestimenta-form.component';

// Pantalla para agregar productos: permite elegir cual de los tres formularios usar.
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  standalone: true,
  imports: [MatButtonToggleModule, PalosFormComponent, EquiposFormComponent, VestimentaFormComponent]
})
export class FormularioComponent {
  readonly seccion = signal<'palos' | 'equipos' | 'vestimenta'>('palos');
}
