import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { Registro } from './registro';
import { LoginService } from '../../Services/login';

describe('Registro', () => {
  function crear(respuesta: Observable<unknown>) {
    const registrar = vi.fn().mockReturnValue(respuesta);
    TestBed.configureTestingModule({
      imports: [Registro],
      providers: [
        provideRouter([]),
        { provide: LoginService, useValue: { registrar } },
      ],
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const alerta = vi.spyOn(Swal, 'fire').mockResolvedValue({} as never);
    const fixture = TestBed.createComponent(Registro);
    fixture.detectChanges();
    return { component: fixture.componentInstance, registrar, navigate, alerta };
  }

  it('empieza con el usuario y la contraseña vacíos', () => {
    const { component } = crear(of({}));

    expect(component.registroForm.value).toEqual({ usuario: '', contrasena: '' });
  });

  it('no envía el formulario vacío', () => {
    const { component, registrar } = crear(of({}));

    component.registrar();

    expect(registrar).not.toHaveBeenCalled();
  });

  it('registra la cuenta y va a inicio de sesión', () => {
    const { component, registrar, navigate, alerta } = crear(of({ message: 'Registro correcto' }));
    component.registroForm.setValue({ usuario: 'ana', contrasena: '12345' });

    component.registrar();

    expect(registrar).toHaveBeenCalledWith({ usuario: 'ana', contrasena: '12345' });
    expect(alerta).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('avisa si el usuario ya existe', () => {
    const { component, alerta } = crear(throwError(() => ({ status: 409 })));
    component.registroForm.setValue({ usuario: 'ana', contrasena: '12345' });

    component.registrar();

    expect(alerta).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Ese usuario ya está registrado.'
    }));
  });
});
