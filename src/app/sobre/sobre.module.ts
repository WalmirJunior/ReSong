import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SobrePageRoutingModule } from './sobre-routing.module';
import { SobrePage } from './sobre.page';
import { ProfileModalComponent } from '../components/profile-modal/profile-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobrePageRoutingModule
  ],
  declarations: [
    SobrePage,
    ProfileModalComponent // Não se esqueça de declarar o componente modal
  ]
})
export class SobrePageModule {}
