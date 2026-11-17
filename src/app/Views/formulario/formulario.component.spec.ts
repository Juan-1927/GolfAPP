import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FormularioComponent } from './formulario.component';
import { PalosService } from '../../Services/palos';
import { EquiposService } from '../../Services/equipos';
import { VestimentaService } from '../../Services/vestimenta';

describe('FormularioComponent', () => {
  async function crear() {
    TestBed.configureTestingModule({
      imports: [FormularioComponent],
      providers: [
        provideRouter([]),
        { provide: PalosService, useValue: {} },
        { provide: EquiposService, useValue: {} },
        { provide: VestimentaService, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(FormularioComponent);
    await fixture.whenStable();
    return fixture;
  }

  function elegir(elemento: HTMLElement, texto: string) {
    const botones = Array.from(elemento.querySelectorAll<HTMLButtonElement>('mat-button-toggle button'));
    botones.find((boton) => boton.textContent?.includes(texto))?.click();
  }

  it('empieza con el formulario de palos', async () => {
    const fixture = await crear();

    expect(fixture.nativeElement.querySelector('app-palos-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-equipos-form')).toBeNull();
  });

  it('cambia al formulario de equipos', async () => {
    const fixture = await crear();

    elegir(fixture.nativeElement, 'Equipos');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-equipos-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-palos-form')).toBeNull();
  });

  it('cambia al formulario de vestimenta', async () => {
    const fixture = await crear();

    elegir(fixture.nativeElement, 'Vestimenta');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-vestimenta-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-palos-form')).toBeNull();
  });
});
