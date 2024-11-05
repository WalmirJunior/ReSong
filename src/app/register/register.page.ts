import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SuccessModalComponent } from '../components/success-modal/success-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router
  ) {}

  async register() {
    try {
      const user = await this.authService.registerUser(this.email, this.password);
      console.log('Usuário registrado:', user);

      // Abre o modal de sucesso
      const modal = await this.showSuccessModal();

      // Aguarda 2 segundos antes do redirecionamento
      setTimeout(async () => {
        // Fecha o modal antes de redirecionar
        await modal.dismiss();
        // Redireciona para a página de login
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      // Aqui você pode exibir uma mensagem de erro ao usuário
    }
  }

  async showSuccessModal() {
    const modal = await this.modalController.create({
      component: SuccessModalComponent,
      cssClass: 'success-modal',
    });
    await modal.present();
    return modal;
  }
}
