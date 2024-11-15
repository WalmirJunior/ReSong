import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { SpotifyService } from '../services/spotify.service'; // Importa o serviço

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

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3, // Mostra 3 cantores por vez
  };

  constructor(private http: HttpClient, private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.getNewReleases();
    this.getTopAlbums();
    this.loadTopArtists();

    this.spotifyService.fetchSpotifyToken().subscribe(
      (tokenData: any) => {
        this.spotifyService.setSpotifyToken(tokenData.access_token); // Define o token
        this.loadTopArtists();
      },
      (error:any) => {
        console.error('Erro ao obter token do Spotify:', error);
      }
    );
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
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.spotifyService.getApiKey()}&limit=${limit}&page=${page}&format=json`
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
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.spotifyService.getApiKey()}&limit=${limit}&page=${page}&format=json`
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

  // Carrega os top artistas e busca suas imagens
  loadTopArtists() {
    this.spotifyService.loadTopArtists().subscribe(
      (artists: any[]) => {
        const filteredArtists = artists.filter(artist => artist.name.toLowerCase() !== 'kanye west'); // Filtra Kanye West
        this.spotifyService.loadArtistsWithImages(filteredArtists).subscribe(
          (artistsWithImages: any[]) => {
            this.topArtists = artistsWithImages;
          },
          (error:any) => {
            console.error('Erro ao carregar imagens dos artistas:', error);
          }
        );
      },
      (error:any) => {
        console.error('Erro ao buscar top artistas no Last.fm:', error);
      }
    );
  }

  // Função chamada quando a imagem é carregada com sucesso
  onImageLoad(imageUrl: string) {
    console.log('Image loaded:', imageUrl);
  }

  // Função chamada quando há erro ao carregar a imagem
  onImageError(imageUrl: string) {
    console.error('Image failed to load:', imageUrl);
  }
}
