import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly url = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  // Iniciar sesión: envía el usuario y la contraseña (body) a la URL
  login(body: any): Observable<any> {
    return this.http.post<any>(this.url, body);
  }

  registrar(body: { usuario: string; contrasena: string }): Observable<{ message: string; usuario: string }> {
    return this.http.post<{ message: string; usuario: string }>(
      `${environment.apiUrl}/registro`,
      body
    );
  }
}
