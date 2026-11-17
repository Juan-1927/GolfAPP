import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PalosFormComponent } from './palos-form.component';
import { PalosService } from '../../Services/palos';

describe('PalosFormComponent', () => {
  let component: PalosFormComponent;
  let fixture: ComponentFixture<PalosFormComponent>;
  let servicio: Record<string, ReturnType<typeof vi.fn>>;
  let navigate: ReturnType<typeof vi.spyOn>;

  const datosValidos = { nombre: 'T100', marca: 'Titleist', precio: 1299 };
  const palo = { id: 7, ...datosValidos, tipo: 'Wedge', material: 'Acero', flexibilidad: 'Stiff' };

  function crear(id?: string): void {
    servicio = {
      crearPalo: vi.fn(),
      actualizarPalo: vi.fn(),
      getPalosById: vi.fn().mockReturnValue(of(palo)),
    };
    TestBed.configureTestingModule({
      imports: [PalosFormComponent],
      providers: [
        provideRouter([]),
        { provide: PalosService, useValue: servicio },
        ...(id
          ? [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } }]
          : []),
      ],
    });
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fixture = TestBed.createComponent(PalosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('no envía un formulario inválido', () => {
    crear();

    component.onSubmit();

    expect(servicio['crearPalo']).not.toHaveBeenCalled();
  });

  it('guarda el palo en la API y abre la tabla', () => {
    crear();
    servicio['crearPalo'].mockReturnValue(of({ id: 3 }));
    component.paloForm.patchValue(datosValidos);

    component.onSubmit();

    expect(servicio['crearPalo']).toHaveBeenCalledWith({
      nombre: 'T100',
      marca: 'Titleist',
      tipo: 'Driver',
      material: 'Grafito',
      flexibilidad: 'Regular',
      precio: 1299,
    });
    expect(navigate).toHaveBeenCalledWith(['/tabla']);
  });

  it('muestra el mensaje del backend y permite reintentar', async () => {
    crear();
    servicio['crearPalo'].mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Datos no válidos' } })),
    );
    component.paloForm.patchValue(datosValidos);

    component.onSubmit();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error-guardado').textContent).toContain('Datos no válidos');
    expect(component.guardando()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('avisa si el backend no responde', async () => {
    crear();
    servicio['crearPalo'].mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    component.paloForm.patchValue(datosValidos);

    component.onSubmit();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error-guardado').textContent).toContain('No se pudo conectar');
  });

  it('en edición carga el palo y lo actualiza', () => {
    crear('7');
    servicio['actualizarPalo'].mockReturnValue(of(palo));

    expect(servicio['getPalosById']).toHaveBeenCalledWith(7);
    expect(component.paloForm.value.tipo).toBe('Wedge');

    component.paloForm.patchValue({ precio: 999 });
    component.onSubmit();

    expect(servicio['actualizarPalo']).toHaveBeenCalledWith(7, expect.objectContaining({ precio: 999 }));
    expect(servicio['crearPalo']).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/tabla']);
  });

  it('en edición avisa si el palo no existe y no deja guardar', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    crearConCargaFallida();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error-guardado').textContent).toContain('Palos no encontrado');
    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBe(true);
  });

  function crearConCargaFallida(): void {
    const getPalosById = vi.fn().mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { message: 'Palos no encontrado' } })),
    );
    TestBed.configureTestingModule({
      imports: [PalosFormComponent],
      providers: [
        provideRouter([]),
        { provide: PalosService, useValue: { getPalosById } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } },
      ],
    });
    fixture = TestBed.createComponent(PalosFormComponent);
    fixture.detectChanges();
  }
});
