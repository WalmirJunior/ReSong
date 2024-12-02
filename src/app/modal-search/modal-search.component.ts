import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(
    private modalController: ModalController,
    private spotifyService: SpotifyService
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  async searchTracks() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
  
    this.spotifyService.searchTracks(this.searchQuery).subscribe((tracks: any[]) => {
      console.log('Tracks retornadas pela API:', tracks); // Adicionado para depuração
      this.searchResults = tracks.map(track => ({
        name: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        albumImage: track.album.images[0]?.url || 'assets/default-album.png', // Imagem do álbum ou padrão
        trackId: track.id,
      }));
    });
  }
  
  

  selectTrack(track: any) {
    this.modalController.dismiss(track); // Fecha o modal e retorna a música selecionada
  }
  
}
