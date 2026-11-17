import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EquiposFormComponent } from './equipos-form.component';
import { EquiposService } from '../../Services/equipos';

describe('EquiposFormComponent', () => {
  const equipo = { id: 4, nombre: 'Bolsa', marca: 'Ping', tipo: 'Bolsa', descripcion: 'Ligera', precio: 200 };

  function crear(id?: string) {
    const servicio = {
      crearEquipo: vi.fn().mockReturnValue(of(equipo)),
      actualizarEquipo: vi.fn().mockReturnValue(of(equipo)),
      getEquipoById: vi.fn().mockReturnValue(of(equipo)),
    };
    TestBed.configureTestingModule({
      imports: [EquiposFormComponent],
      providers: [
        provideRouter([]),
        { provide: EquiposService, useValue: servicio },
        ...(id
          ? [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } }]
          : []),
      ],
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(EquiposFormComponent);
    fixture.detectChanges();
    return { component: fixture.componentInstance, servicio, navigate };
  }

  it('crea un equipo y vuelve a la lista', () => {
    const { component, servicio, navigate } = crear();
    const { id, ...datos } = equipo;
    component.equipoForm.patchValue(datos);

    component.onSubmit();

    expect(servicio.crearEquipo).toHaveBeenCalledWith(datos);
    expect(navigate).toHaveBeenCalledWith(['/equipos']);
  });

  it('en edición carga el equipo y lo actualiza', () => {
    const { component, servicio } = crear('4');

    expect(component.equipoForm.value.descripcion).toBe('Ligera');

    component.onSubmit();

    expect(servicio.actualizarEquipo).toHaveBeenCalledWith(4, expect.objectContaining({ nombre: 'Bolsa' }));
    expect(servicio.crearEquipo).not.toHaveBeenCalled();
  });
});
