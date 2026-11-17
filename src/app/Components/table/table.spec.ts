import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Table } from './table';

describe('Table', () => {
  let fixture: ComponentFixture<Table>;
  const filas = [
    { id: 1, nombre: 'Stealth 2', precio: 1299.5, fecha_creacion: '2026-10-05T18:00:00.000Z' },
    { id: 2, nombre: 'Paradym', precio: 349, fecha_creacion: '2026-10-05T18:05:00.000Z' },
  ];

  async function crear(datos?: unknown[], error: string | null = null): Promise<HTMLElement> {
    TestBed.configureTestingModule({ imports: [Table], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Table);
    fixture.componentRef.setInput('etiqueta', 'Prueba');
    fixture.componentRef.setInput('rutaFormulario', '/formulario');
    fixture.componentRef.setInput('datos', datos);
    fixture.componentRef.setInput('error', error);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  const numeroDeFilas = (elemento: HTMLElement) => elemento.querySelectorAll('tr[mat-row]').length;
  const botonEliminar = (elemento: HTMLElement) =>
    elemento.querySelector('button.eliminar') as HTMLButtonElement;

  it('crea las columnas a partir de los datos, sin la fecha de creación', async () => {
    const elemento = await crear(filas);
    const titulos = Array.from(elemento.querySelectorAll('th')).map((th) => th.textContent?.trim());

    expect(titulos).toEqual(['Id', 'Nombre', 'Precio', 'Acciones']);
  });

  it('pasa de no tener columnas a tenerlas cuando llegan los datos', async () => {
    const elemento = await crear(undefined);

    fixture.componentRef.setInput('datos', filas);
    await fixture.whenStable();

    expect(elemento.querySelectorAll('th').length).toBe(4);
    expect(numeroDeFilas(elemento)).toBe(2);
  });

  it('muestra los datos que recibe, con precio con formato y enlace de edición', async () => {
    const elemento = await crear(filas);

    expect(numeroDeFilas(elemento)).toBe(2);
    expect(elemento.textContent).toContain('$1,299.50');
    expect(elemento.querySelector('td a')?.getAttribute('href')).toBe('/formulario/1');
    expect(elemento.querySelector('.estado')).toBeNull();
  });

  it('se actualiza cuando la vista le pasa datos nuevos', async () => {
    const elemento = await crear(filas);

    fixture.componentRef.setInput('datos', [filas[1]]);
    await fixture.whenStable();

    expect(numeroDeFilas(elemento)).toBe(1);
    expect(elemento.textContent).not.toContain('Stealth 2');
  });

  it('indica que está cargando mientras no recibe datos', async () => {
    const elemento = await crear(undefined);

    expect(elemento.querySelector('.estado')?.textContent).toContain('Cargando');
  });

  it('avisa cuando no hay registros', async () => {
    const elemento = await crear([]);

    expect(elemento.querySelector('.estado')?.textContent).toContain('no hay registros');
  });

  it('muestra el error que le pasa la vista', async () => {
    const elemento = await crear(undefined, 'Sin conexión');

    expect(elemento.querySelector('.estado-error')?.textContent).toContain('Sin conexión');
    expect(elemento.textContent).not.toContain('Cargando');
  });

  it('pide confirmación y avisa a la vista con el id', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const elemento = await crear(filas);
    const eliminado = vi.fn();
    fixture.componentInstance.eliminar.subscribe(eliminado);

    botonEliminar(elemento).click();

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Stealth 2'));
    expect(eliminado).toHaveBeenCalledWith(1);
  });

  it('no avisa si se cancela la confirmación', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const elemento = await crear(filas);
    const eliminado = vi.fn();
    fixture.componentInstance.eliminar.subscribe(eliminado);

    botonEliminar(elemento).click();

    expect(eliminado).not.toHaveBeenCalled();
  });
});
