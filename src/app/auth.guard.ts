import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth'; // Para verificar o estado de autenticação

@Injectable({
  providedIn: 'root', // Isso torna o guard disponível em toda a aplicação
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.auth.currentUser) {
      return true; // Permite a navegação se o usuário estiver autenticado
    } else {
      this.router.navigate(['/login']); // Redireciona para o login se não estiver autenticado
      return false; // Bloqueia a navegação
    }
  }
}
