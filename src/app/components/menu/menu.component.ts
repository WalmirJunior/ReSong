import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth'; // Importando o Firebase Authentication


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  
  constructor(private router: Router, private auth: Auth) {} // Injetando o Router e Auth

  ngOnInit() {}

  // Método para navegação
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Método de logout
  async logout() {
    try {
      await signOut(this.auth); // Firebase encerra a sessão
      // Garantir que o redirecionamento para login é feito corretamente
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  }
  
  
}
