import { RenderMode, ServerRoute } from '@angular/ssr';

// Estas rutas piden datos a la API y se renderizan en el navegador: si se
// prerenderizaran, mostrarian los datos que existian al compilar la aplicacion.
const rutasConDatos = [
  'palos',
  'tabla',
  'formulario/:id',
  'equipos',
  'equipos/formulario/:id',
  'vestimenta',
  'vestimenta/formulario/:id'
];

export const serverRoutes: ServerRoute[] = [
  ...rutasConDatos.map((path) => ({ path, renderMode: RenderMode.Client as const })),
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
