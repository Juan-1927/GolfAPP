import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VestimentaFormComponent } from './vestimenta-form.component';
import { VestimentaService } from '../../Services/vestimenta';

describe('VestimentaFormComponent', () => {
  const prenda = { id: 5, nombre: 'Polo', marca: 'Nike', talla: 'L', color: 'Azul', precio: 49.99 };

  function crear(id?: string) {
    const servicio = {
      crearPrenda: vi.fn().mockReturnValue(of(prenda)),
      actualizarPrenda: vi.fn().mockReturnValue(of(prenda)),
      getPrendaById: vi.fn().mockReturnValue(of(prenda)),
    };
    TestBed.configureTestingModule({
      imports: [VestimentaFormComponent],
      providers: [
        provideRouter([]),
        { provide: VestimentaService, useValue: servicio },
        ...(id
          ? [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } }]
          : []),
      ],
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(VestimentaFormComponent);
    fixture.detectChanges();
    return { component: fixture.componentInstance, servicio, navigate };
  }

  it('crea una prenda y vuelve a la lista', () => {
    const { component, servicio, navigate } = crear();
    const { id, ...datos } = prenda;
    component.prendaForm.patchValue(datos);

    component.onSubmit();

    expect(servicio.crearPrenda).toHaveBeenCalledWith(datos);
    expect(navigate).toHaveBeenCalledWith(['/vestimenta']);
  });

  it('en edición carga la prenda y la actualiza', () => {
    const { component, servicio } = crear('5');

    expect(component.prendaForm.value.talla).toBe('L');

    component.onSubmit();

    expect(servicio.actualizarPrenda).toHaveBeenCalledWith(5, expect.objectContaining({ color: 'Azul' }));
    expect(servicio.crearPrenda).not.toHaveBeenCalled();
  });
});
