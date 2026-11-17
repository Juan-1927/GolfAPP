import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly url = 'http://localhost:3000/api/v1/login';

  constructor(private http: HttpClient) {}

  // Iniciar sesión: envía el usuario y la contraseña (body) a la URL
  login(body: any): Observable<any> {
    return this.http.post<any>(this.url, body);
  }
}
