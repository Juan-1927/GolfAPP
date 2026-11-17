import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

// Tabla reutilizable: no tiene datos propios. Cada vista le pasa sus datos
// y la tabla crea sus columnas a partir de ellos.
@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  // undefined mientras la vista todavia esta cargando los datos.
  readonly datos = input<any[] | undefined>(undefined);
  readonly etiqueta = input.required<string>();
  readonly rutaFormulario = input.required<string>();
  readonly error = input<string | null>(null);

  readonly eliminar = output<number>();

  // Las columnas son los campos del primer registro (id, nombre, marca...).
  // La fecha de creacion no se muestra.
  columnas(): string[] {
    const primero = this.datos()?.[0];

    if (!primero) {
      return [];
    }

    return Object.keys(primero).filter((campo) => campo !== 'fecha_creacion');
  }

  // Las columnas de datos mas la columna de los botones.
  columnasVisibles(): string[] {
    return [...this.columnas(), 'acciones'];
  }

  // Convierte el nombre del campo en un titulo: "nombre" -> "Nombre".
  titulo(campo: string): string {
    return campo.charAt(0).toUpperCase() + campo.slice(1);
  }

  confirmarEliminar(fila: { id: number; nombre: string }): void {
    if (window.confirm(`¿Eliminar "${fila.nombre}"? Esta acción no se puede deshacer.`)) {
      this.eliminar.emit(fila.id);
    }
  }
}
