import { Component, signal } from '@angular/core';
import { Table } from '../../Components/table/table';
import { EquiposService } from '../../Services/equipos';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [Table],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css',
})
export class Equipos {
  readonly equipos = signal<any[] | undefined>(undefined);
  readonly error = signal<string | null>(null);

  constructor(private equiposService: EquiposService) {
    this.equiposService.getEquipos().subscribe({
      next: (equipos) => this.equipos.set(equipos),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudieron cargar los equipos.')),
    });
  }

  eliminar(id: number): void {
    this.error.set(null);
    this.equiposService.eliminarEquipo(id).subscribe({
      next: () => this.equipos.update((equipos) => equipos?.filter((equipo) => equipo.id !== id)),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudo eliminar el equipo.')),
    });
  }
}
