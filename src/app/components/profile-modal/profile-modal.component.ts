import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent {

  @Input() profileId!: number;  // Recebe o ID do perfil para saber qual descrição mostrar

  profileData: any;

  profiles = [
    {
      id: 1,
      name: 'Integrante 1',
      description: 'Descrição do Integrante 1',
    },
    {
      id: 2,
      name: 'Integrante 2',
      description: 'Descrição do Integrante 2',
    },
    {
      id: 3,
      name: 'Integrante 3',
      description: 'Descrição do Integrante 3',
    }
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {

    this.profileData = this.profiles.find(p => p.id === this.profileId);
    
  }

  // Fechar o modal
  dismiss() {
    this.modalController.dismiss();
  }
}
