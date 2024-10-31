import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(private navCtrl: NavController) { }

  navigateToLogin() {
    console.log('botao ta funfando')
    this.navCtrl.navigateForward('/login');
  }
}
