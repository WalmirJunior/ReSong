import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importe o AuthGuard que criamos

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash', // Redireciona a rota inicial para a tela de splash
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard], // Aplica o guard para proteger a rota
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'new-releases',
    canActivate: [AuthGuard], // Protege a página de new-releases
    loadChildren: () => import('./new-releases/new-releases.module').then(m => m.NewReleasesPageModule),
  },
  {
    path: 'sobre',
    loadChildren: () => import('./sobre/sobre.module').then(m => m.SobrePageModule),
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
