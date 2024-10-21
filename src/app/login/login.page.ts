import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async login() {
    // Validação simples para fins de teste
    if (this.email === 'admin' && this.password === 'admin') {
      // Redirecionar para a página de reviews após login
      this.router.navigate(['/sobre']);
    } else {
      const alert = await this.alertController.create({
        header: 'Login Falhou',
        message: 'Email ou senha incorretos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
