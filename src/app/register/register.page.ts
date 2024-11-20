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
  username: string = ''; // Novo campo para o username

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router
  ) {}

  async register() {
    try {
      const user = await this.authService.registerUser(this.email, this.password, this.username);
      console.log('Usuário registrado:', user);
  
      const modal = await this.showSuccessModal();
  
      setTimeout(async () => {
        await modal.dismiss();
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
  
      // Exibe uma mensagem de erro ao usuário, garantindo que `message` existe
      const errorMessage = error?.message || 'Ocorreu um erro desconhecido.';
      alert(errorMessage);
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
