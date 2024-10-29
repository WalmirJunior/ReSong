import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Usuário logado:', userCredential.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async register() {
    try {
      const userCredential = await this.authService.register(this.email, this.password);
      console.log('Usuário registrado:', userCredential.user);
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  }
}
