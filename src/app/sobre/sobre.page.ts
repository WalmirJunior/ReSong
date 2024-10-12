import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileModalComponent } from '../components/profile-modal/profile-modal.component';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage {
  constructor(private modalController: ModalController) {}

  async openModal(profileId: number) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        profileId: profileId
      }
    });
    return await modal.present();
  }
}
