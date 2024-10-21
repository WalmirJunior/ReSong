import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  apiKey = '30a102a7276dfdd1e9ff99441bdb05b5'; // Insira sua chave da API do Last.fm
  albumReviews = [
    {
      user: 'Junin Taylor\'s Version',
      album: 'midnights',
      artist: 'Taylor Swift',
      description: 'Este é o melhor álbum que já ouvi e adorei cada segundo dele. Taylor se reinventou com este, soando muito diferente de como soava antes.',
      stars: 5,
      albumImage: '',  // Placeholder para a URL da imagem do álbum
      userImage: 'assets/img/profile1.jpg'  // Imagem do usuário
    },
    {
      user: 'Brendinha Taylor\'s Version',
      album: 'Folklore',
      artist: 'Taylor Swift',
      description: 'Uma experiência incrível que mistura experiências autênticas de amor jovem e desgosto, misturando pop com folk.',
      stars: 5,
      albumImage: '',
      userImage: 'assets/img/profile2.png'  // Imagem do usuário
    },
    {
      user: 'Kaylaine Taylor\'s Version',
      album: '1989 taylor\'s version',
      artist: 'Taylor Swift',
      description: 'O álbum não é puro ódio, mas uma carta de amor disfarçada.',
      stars: 5,
      albumImage: '',
      userImage: 'assets/img/profile3.png'  // Imagem do usuário
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAlbumImages();
  }

  loadAlbumImages() {
    this.albumReviews.forEach((review, index) => {
      const url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${this.apiKey}&artist=${encodeURIComponent(review.artist)}&album=${encodeURIComponent(review.album)}&format=json`;

      this.http.get(url).subscribe((data: any) => {
        if (data && data.album && data.album.image) {
          // Pega a imagem de tamanho médio (você pode escolher outro tamanho, se preferir)
          this.albumReviews[index].albumImage = data.album.image[2]['#text']; // Tamanho médio da imagem
        }
      }, error => {
        console.error('Erro ao carregar a imagem do álbum', error);
      });
    });
  }
}
