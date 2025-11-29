import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'libro/:id', component: LibroDetalleComponent },
  { path: 'prestamos', component: PrestamosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'qr-scanner', component: QrScannerComponent },
  { path: '**', redirectTo: '/home' }
];
