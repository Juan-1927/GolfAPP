import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VestimentaService {
  private readonly url = 'http://localhost:3000/api/v1/vestimenta';

  constructor(private http: HttpClient) {}

  getVestimenta(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getPrendaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crearPrenda(prenda: any): Observable<any> {
    return this.http.post<any>(this.url, prenda);
  }

  actualizarPrenda(id: number, prenda: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, prenda);
  }

  eliminarPrenda(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
