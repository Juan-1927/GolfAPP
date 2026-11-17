import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Equipos } from './equipos';
import { EquiposService } from '../../Services/equipos';

describe('Equipos', () => {
  it('carga los equipos, se los pasa a la tabla y elimina', async () => {
    const eliminarEquipo = vi.fn().mockReturnValue(of(null));
    TestBed.configureTestingModule({
      imports: [Equipos],
      providers: [
        provideRouter([]),
        {
          provide: EquiposService,
          useValue: { getEquipos: () => of([{ id: 4, nombre: 'Bolsa', precio: 200 }]), eliminarEquipo },
        },
      ],
    });

    const fixture = TestBed.createComponent(Equipos);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(1);
    expect(fixture.nativeElement.querySelector('a[href="/equipos/formulario"]')).not.toBeNull();

    fixture.componentInstance.eliminar(4);
    await fixture.whenStable();

    expect(eliminarEquipo).toHaveBeenCalledWith(4);
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(0);
  });
});
