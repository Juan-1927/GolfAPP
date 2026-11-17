import { Component, signal } from '@angular/core';
import { Table } from '../../Components/table/table';
import { PalosService } from '../../Services/palos';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-palos',
  standalone: true,
  imports: [Table],
  templateUrl: './palos.html',
  styleUrl: './palos.css',
})
export class Palos {
  readonly palos = signal<any[] | undefined>(undefined);
  readonly error = signal<string | null>(null);

  constructor(private palosService: PalosService) {
    this.palosService.getPalos().subscribe({
      next: (palos) => this.palos.set(palos),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudieron cargar los palos.')),
    });
  }

  eliminar(id: number): void {
    this.error.set(null);
    this.palosService.eliminarPalo(id).subscribe({
      next: () => this.palos.update((palos) => palos?.filter((palo) => palo.id !== id)),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudo eliminar el palo.')),
    });
  }
}
