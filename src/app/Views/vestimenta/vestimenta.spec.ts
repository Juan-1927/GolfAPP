import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Vestimenta } from './vestimenta';
import { VestimentaService } from '../../Services/vestimenta';

describe('Vestimenta', () => {
  it('carga la vestimenta, se la pasa a la tabla y elimina', async () => {
    const eliminarPrenda = vi.fn().mockReturnValue(of(null));
    TestBed.configureTestingModule({
      imports: [Vestimenta],
      providers: [
        provideRouter([]),
        {
          provide: VestimentaService,
          useValue: { getVestimenta: () => of([{ id: 5, nombre: 'Polo', precio: 49.99 }]), eliminarPrenda },
        },
      ],
    });

    const fixture = TestBed.createComponent(Vestimenta);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(1);
    expect(fixture.nativeElement.querySelector('a[href="/vestimenta/formulario"]')).not.toBeNull();

    fixture.componentInstance.eliminar(5);
    await fixture.whenStable();

    expect(eliminarPrenda).toHaveBeenCalledWith(5);
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(0);
  });
});
