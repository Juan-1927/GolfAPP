import { Component, signal } from '@angular/core';
import { Table } from '../../Components/table/table';
import { VestimentaService } from '../../Services/vestimenta';
import { mensajeDeError } from '../../Services/mensaje-error';

@Component({
  selector: 'app-vestimenta',
  standalone: true,
  imports: [Table],
  templateUrl: './vestimenta.html',
  styleUrl: './vestimenta.css',
})
export class Vestimenta {
  readonly prendas = signal<any[] | undefined>(undefined);
  readonly error = signal<string | null>(null);

  constructor(private vestimentaService: VestimentaService) {
    this.vestimentaService.getVestimenta().subscribe({
      next: (prendas) => this.prendas.set(prendas),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudo cargar la vestimenta.')),
    });
  }

  eliminar(id: number): void {
    this.error.set(null);
    this.vestimentaService.eliminarPrenda(id).subscribe({
      next: () => this.prendas.update((prendas) => prendas?.filter((prenda) => prenda.id !== id)),
      error: (error) => this.error.set(mensajeDeError(error, 'No se pudo eliminar la prenda.')),
    });
  }
}
