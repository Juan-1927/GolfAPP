import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { Login } from './login';
import { LoginService } from '../../Services/login';

describe('Login', () => {
  function crear(respuesta: unknown) {
    const login = vi.fn().mockReturnValue(respuesta);
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: LoginService, useValue: { login } }],
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const alerta = vi.spyOn(Swal, 'fire').mockResolvedValue({} as never);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    localStorage.clear();
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    return { component: fixture.componentInstance, login, navigate, alerta };
  }

  it('empieza con el usuario y la contraseña vacíos', () => {
    const { component } = crear(of({}));

    expect(component.loginForm.value).toEqual({ usuario: '', contrasena: '' });
  });

  it('no envía el formulario vacío', () => {
    const { component, login } = crear(of({}));

    component.ingresar();

    expect(login).not.toHaveBeenCalled();
  });

  it('si es correcto: guarda en localStorage, muestra la alerta de éxito y va a palos', () => {
    const { component, login, navigate, alerta } = crear(of({}));
    component.loginForm.setValue({ usuario: 'juan', contrasena: '12345' });

    component.ingresar();

    expect(console.log).toHaveBeenCalledWith(component.loginForm.controls);
    expect(login).toHaveBeenCalledWith({ usuario: 'juan', contrasena: '12345' });
    expect(localStorage.getItem('usuario')).toBe('juan');
    expect(localStorage.getItem('contrasena')).toBe('12345');
    expect(alerta).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    expect(navigate).toHaveBeenCalledWith(['/palos']);
  });

  it('si es incorrecto: muestra la alerta de error y no guarda nada', () => {
    const { component, navigate, alerta } = crear(throwError(() => new Error('401')));
    component.loginForm.setValue({ usuario: 'juan', contrasena: 'mala' });

    component.ingresar();

    expect(alerta).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
