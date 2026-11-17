import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class PalosService {
 
  private readonly url = 'http://localhost:3000/api/v1/palos';
 
  constructor(private http: HttpClient) {}
 
  // Obtener todos los palos
  public getPalos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
 
  // Obtener un palo por ID
  getPalosById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
 
  // Crear un palo
  crearPalo(palo : any): Observable<any> {
    return this.http.post<any>(this.url, palo);
  }
 
  // Actualizar completamente un palo
  actualizarPalo(id: number, palo: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, palo);
  }
 
  // Actualizar parcialmente un palo
  actualizarParcialPalo(id: number, palo: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, palo);
  }
 
  // Eliminar un palo
  eliminarPalo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}