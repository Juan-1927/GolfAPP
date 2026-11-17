import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PalosService } from './palos';

describe('PalosService', () => {
  const url = 'http://localhost:3000/api/v1/palos';
  let service: PalosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PalosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta la lista de palos', () => {
    service.getPalos().subscribe();

    expect(http.expectOne(url).request.method).toBe('GET');
  });

  it('elimina un palo por su id', () => {
    service.eliminarPalo(7).subscribe();

    expect(http.expectOne(`${url}/7`).request.method).toBe('DELETE');
  });
});
