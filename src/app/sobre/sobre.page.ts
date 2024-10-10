import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Importação do ModalController
import { ProfileModalComponent } from '../components/profile-modal/profile-modal.component'; // Verifique o caminho correto

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openModal(profileId: number) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        profileId: +profileId  // Passa o ID correto
      }
    });

    return await modal.present();
  }
}
