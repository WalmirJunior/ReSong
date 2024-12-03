import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Certifique-se de que o AngularFire está configurado
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async onResetPassword() {
    if (!this.email) return;

    const loading = await this.loadingCtrl.create({
      message: 'Enviando email...',
    });
    await loading.present();

    this.afAuth
      .sendPasswordResetEmail(this.email)
      .then(async () => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Um link de redefinição foi enviado para o seu email.',
          buttons: ['OK'],
        });
        await alert.present();
      })
      .catch(async (error) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Erro ao enviar email: ' + error.message,
          buttons: ['OK'],
        });
        await alert.present();
      });
  }
}
