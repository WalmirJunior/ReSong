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
      name: 'Walmir',
      description: 'Album Favorito: Máquina do Tempo - Matuê ',
    },
    {
      id: 2,
      name: 'Brenda',
      description: 'Artista favorita: Taylor Swift',
    },
    {
      id: 3,
      name: 'Kaylaine',
      description: 'Musica favorita: ticktock - Joji ',
    }
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {

    this.profileData = this.profiles.find(p => p.id === this.profileId);
    console.log(this.profileData);

  }

  // Fechar o modal
  dismiss() {
    this.modalController.dismiss();
  }
}
