import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth'; // Importação do Firebase Authentication

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private auth: Auth // Injetando o serviço de autenticação do Firebase
  ) {}

  async login() {
    try {
      // Tenta fazer o login com o Firebase
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      // Se bem-sucedido, navega para a página de reviews
      this.router.navigate(['/tabs']);
    } catch (error) {
      // Mostra alerta se o login falhar
      const alert = await this.alertController.create({
        header: 'Login Falhou',
        message: 'Email ou senha incorretos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  async logout() {
    try {
      await this.auth.signOut(); // Firebase encerra a sessão
      this.router.navigate(['/login']); // Redireciona para a página de login
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Não foi possível sair. Tente novamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  

}
