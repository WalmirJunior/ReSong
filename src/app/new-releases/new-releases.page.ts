import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation } from 'swiper';

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.page.html',
  styleUrls: ['./new-releases.page.scss'],
})
export class NewReleasesPage implements OnInit {
  newAlbums: any[] = [];
  topAlbums: any[] = [];
  topArtists: any[] = [];
  pageNewReleases: number = 1; // Controle de paginação para New Releases
  pageTopAlbums: number = 1;   // Controle de paginação para Top Albums
  selectedGenre: string = 'pop'; // Gênero selecionado pelo usuário

  apiKey: string = '30a102a7276dfdd1e9ff99441bdb05b5';

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3, // Mostra 3 cantores por vez
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getNewReleases();
    this.getTopAlbums();
    this.getTopArtists();
  }

  // Função chamada quando o usuário muda o gênero
  onGenreChange() {
    this.pageNewReleases = 1;
    this.pageTopAlbums = 1;
    this.getNewReleases();
    this.getTopAlbums();
  }

  // Pega os álbuns lançados recentemente com base no gênero selecionado
  getNewReleases() {
    const limit = 5;
    const page = this.pageNewReleases;
    this.http
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.apiKey}&limit=${limit}&page=${page}&format=json`
      )
      .subscribe(
        (response: any) => {
          this.newAlbums = response.albums.album;
        },
        (error) => {
          console.error('Erro ao buscar New Releases:', error);
        }
      );
  }

  // Pega os álbuns mais populares com base no gênero selecionado
  getTopAlbums() {
    const limit = 5;
    const page = this.pageTopAlbums;

    this.http
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.apiKey}&limit=${limit}&page=${page}&format=json`
      )
      .subscribe(
        (response: any) => {
          this.topAlbums = response.albums.album;
        },
        (error) => {
          console.error('Erro ao buscar Top Albums:', error);
        }
      );
  }

  // Função para carregar mais álbuns ao rolar a página
  loadMoreAlbums(event: any) {
    this.pageNewReleases++;  // Incrementa a página de New Releases
    this.pageTopAlbums++;    // Incrementa a página de Top Albums

    this.getNewReleases();   // Carrega mais New Releases
    this.getTopAlbums();     // Carrega mais Top Albums

    setTimeout(() => {
      event.target.complete(); // Finaliza o loading
    }, 1000);
  }

  // Função para atualizar manualmente os novos lançamentos
  refreshNewReleases() {
    this.pageNewReleases++; // Incrementa a página para pegar novos resultados
    this.getNewReleases(); // Chama o método que faz a requisição à API
  }

  getTopArtists() {
    this.http
  .get(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${this.apiKey}&format=json`
  )
  .subscribe(
    (response: any) => {
      console.log('API Response:', response); // Para inspecionar a estrutura completa
      this.topArtists = response.artists.artist.map((artist: any) => {
        const image = artist.image.find((img: any) => img.size === 'medium');
        console.log('Artist:', artist.name, 'Image:', image ? image['#text'] : 'No image found');
        return {
          name: artist.name,
          image: image ? image['#text'] : 'assets/default-artist.png', // Fallback para imagem padrão
        };
      });
    },
    (error) => {
      console.error('Erro ao buscar top artistas:', error);
    }
  );

  }
  onImageLoad(imageUrl: string) {
    console.log('Image loaded:', imageUrl);
  }

  onImageError(imageUrl: string) {
    console.error('Image failed to load:', imageUrl);
  }

  }



