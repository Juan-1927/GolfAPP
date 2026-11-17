import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PalosService } from '../../Services/palos';
import { Palos } from './palos';

describe('Palos', () => {
  const palos = [
    { id: 1, nombre: 'Stealth 2', precio: 599 },
    { id: 2, nombre: 'Paradym', precio: 349 },
  ];

  async function crear(servicio: Partial<Record<keyof PalosService, unknown>>) {
    TestBed.configureTestingModule({
      imports: [Palos],
      providers: [provideRouter([]), { provide: PalosService, useValue: servicio }],
    });
    const fixture = TestBed.createComponent(Palos);
    await fixture.whenStable();
    return fixture;
  }

  it('carga los palos y se los pasa a la tabla', async () => {
    const fixture = await crear({ getPalos: () => of(palos) });

    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(2);
    expect(fixture.nativeElement.querySelector('a[href="/formulario"]')).not.toBeNull();
  });

  it('elimina en la API y quita la fila', async () => {
    const eliminarPalo = vi.fn().mockReturnValue(of(null));
    const fixture = await crear({ getPalos: () => of(palos), eliminarPalo });

    fixture.componentInstance.eliminar(1);
    await fixture.whenStable();

    expect(eliminarPalo).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(1);
  });

  it('conserva la fila y muestra el error si falla la eliminación', async () => {
    const error = new HttpErrorResponse({ status: 404, error: { message: 'Palos no encontrado' } });
    const fixture = await crear({ getPalos: () => of(palos), eliminarPalo: () => throwError(() => error) });

    fixture.componentInstance.eliminar(1);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(2);
    expect(fixture.nativeElement.querySelector('[role=alert]').textContent).toContain('Palos no encontrado');
  });

  it('muestra un error si no se pueden cargar', async () => {
    const fixture = await crear({ getPalos: () => throwError(() => new HttpErrorResponse({ status: 0 })) });

    expect(fixture.nativeElement.querySelector('.estado-error').textContent).toContain('No se pudo conectar');
  });
});
