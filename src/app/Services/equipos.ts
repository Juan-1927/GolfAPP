import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquiposService {
  private readonly url = 'http://localhost:3000/api/v1/equipos';

  constructor(private http: HttpClient) {}

  getEquipos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getEquipoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crearEquipo(equipo: any): Observable<any> {
    return this.http.post<any>(this.url, equipo);
  }

  actualizarEquipo(id: number, equipo: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, equipo);
  }

  eliminarEquipo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
