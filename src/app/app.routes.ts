import { Routes } from '@angular/router';
import { Palos } from './Views/palos/palos';
import { Equipos } from './Views/equipos/equipos';
import { Vestimenta } from './Views/vestimenta/vestimenta';
import { PalosFormComponent } from './Views/palos-form/palos-form.component';
import { EquiposFormComponent } from './Views/equipos-form/equipos-form.component';
import { VestimentaFormComponent } from './Views/vestimenta-form/vestimenta-form.component';
import { FormularioComponent } from './Views/formulario/formulario.component';
import { Login } from './Views/login/login';
import { Registro } from './Views/registro/registro';

export const routes: Routes = [
  { path: 'palos', component: Palos },
  { path: 'equipos', component: Equipos },
  { path: 'equipos/formulario', component: EquiposFormComponent },
  { path: 'equipos/formulario/:id', component: EquiposFormComponent },
  { path: 'vestimenta', component: Vestimenta },
  { path: 'vestimenta/formulario', component: VestimentaFormComponent },
  { path: 'vestimenta/formulario/:id', component: VestimentaFormComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'formulario/:id', component: PalosFormComponent },
  { path: 'tabla', component: Palos },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '', redirectTo: 'palos', pathMatch: 'full' }
];
