import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { SpotifyService } from '../services/spotify.service'; // Importa o serviço
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

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
  pageTopAlbums: number = 1; // Controle de paginação para Top Albums
  selectedGenre: string = 'pop'; // Gênero selecionado pelo usuário

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: window.innerWidth < 768 ? 1 : 3,
  };

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializePage();
    }
  }

  // Inicialização principal da página
  initializePage() {
    this.getNewReleases();
    this.getTopAlbums();
    this.fetchSpotifyTokenAndLoadArtists();
  }

  // Obter token do Spotify e carregar artistas
  fetchSpotifyTokenAndLoadArtists() {
    this.spotifyService.fetchSpotifyToken().subscribe(
      (tokenData: any) => {
        this.spotifyService.setSpotifyToken(tokenData.access_token); // Define o token
        this.loadTopArtists();
      },
      (error: any) => {
        console.error('Erro ao obter token do Spotify:', error);
      }
    );
  }

  onGenreChange() {
    this.pageNewReleases = 1;
    this.pageTopAlbums = 1;
    this.getNewReleases();
    this.getTopAlbums();
  }

  getNewReleases() {
    const limit = 5;
    const page = this.pageNewReleases;
    this.http
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.spotifyService.getApiKey()}&limit=${limit}&page=${page}&format=json`
      )
      .subscribe(
        (response: any) => {
          this.newAlbums = response.albums?.album || [];
        },
        (error) => {
          console.error('Erro ao buscar New Releases:', error);
        }
      );
  }

  getTopAlbums() {
    const limit = 5;
    const page = this.pageTopAlbums;
    this.http
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${this.selectedGenre}&api_key=${this.spotifyService.getApiKey()}&limit=${limit}&page=${page}&format=json`
      )
      .subscribe(
        (response: any) => {
          this.topAlbums = response.albums?.album || [];
        },
        (error) => {
          console.error('Erro ao buscar Top Albums:', error);
        }
      );
  }

  loadMoreAlbums(event: any) {
    this.pageNewReleases++;
    this.pageTopAlbums++;

    // Atualiza os arrays com mais dados
    this.getNewReleases();
    this.getTopAlbums();

    setTimeout(() => {
      event.target.complete(); // Finaliza o carregamento
    }, 1000);
  }

  refreshNewReleases() {
    this.pageNewReleases++;
    this.getNewReleases();
  }

  loadTopArtists() {
    this.spotifyService.loadTopArtists().subscribe(
      (artists: any[]) => {
        const filteredArtists = artists.filter(
          (artist) => artist.name.toLowerCase().trim() !== 'kanye west'
        );

        this.spotifyService.loadArtistsWithImages(filteredArtists).subscribe(
          (artistsWithImages: any[]) => {
            this.topArtists = artistsWithImages;
          },
          (error: any) => {
            console.error('Erro ao carregar imagens dos artistas:', error);
          }
        );
      },
      (error: any) => {
        console.error('Erro ao buscar top artistas no Last.fm:', error);
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
