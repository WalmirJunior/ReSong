import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Importa variáveis de ambiente
import { catchError, map } from 'rxjs/operators'; // Importa operadores RxJS
import { Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiKey = environment.lastFmApiKey; // Obtém chave da API do environment
  private clientId = environment.spotifyClientId; // Agora busca do environment
  private clientSecret = environment.spotifyClientSecret; // Agora busca do environment
  private spotifyToken: string = '';

  constructor(private http: HttpClient) {}

  // Método para definir o token do Spotify
  setSpotifyToken(token: string) {
    this.spotifyToken = token; // Usa o token recebido no parâmetro
  }

  // Método para obter o token do Spotify
  getSpotifyToken(): string {
    return this.spotifyToken;
  }

  // Método para obter a API key do Last.fm
  getApiKey(): string {
    return this.apiKey;
  }

  // Obtenha o token do Spotify usando clientId e clientSecret do environment
  fetchSpotifyToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`), // Usa clientId e clientSecret do environment
    });
    const body = 'grant_type=client_credentials';

    return this.http.post('https://accounts.spotify.com/api/token', body, { headers });
  }

  // Carregar top artistas do Last.fm
  loadTopArtists(): Observable<any[]> {
    return this.http
      .get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${this.apiKey}&format=json`)
      .pipe(
        map((response: any) => {
          return response.artists.artist.filter((artist: any) => artist.name.toLowerCase() !== 'kanye west');
        }),
        catchError((error:any) => {
          console.error('Erro ao buscar top artistas no Last.fm:', error);
          return of([]);
        })
      );
  }

  // Função para buscar a imagem do artista no Spotify
  getSpotifyArtistImage(artistName: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.spotifyToken}`,
    });
    return this.http.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, { headers });
  }

  // Função para buscar e combinar imagens dos artistas do Last.fm e do Spotify, excluindo Kanye West
  loadArtistsWithImages(artists: any[]): Observable<any[]> {
    const artistRequests = artists.map((artist: any) => {
      if (artist.name.toLowerCase() === 'kanye west') {
        return of(null); // Ignora Kanye West
      }

      return this.getSpotifyArtistImage(artist.name).pipe(
        map((spotifyResponse: any) => {
          const image = spotifyResponse.artists.items[0]?.images[0]?.url;
          return {
            name: artist.name,
            image: image ? image : 'assets/default-artist.png',
          };
        }),
        catchError((error:any) => {
          console.error('Erro ao buscar imagem do Spotify:', error);
          return of({
            name: artist.name,
            image: 'assets/default-artist.png',
          });
        })
      );
    });

    return forkJoin(artistRequests).pipe(
      map((artists: any[]) => artists.filter((artist: any) => artist !== null)) // Remove valores nulos, incluindo Kanye West
    );
  }

  getSpotifyTrackImage(trackName: string, artistName: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.spotifyToken}`,
    });
  
    return this.http.get(`https://api.spotify.com/v1/search?q=track:${trackName} artist:${artistName}&type=track`, { headers }).pipe(
      map((response: any) => {
        const track = response.tracks.items[0];
        return track ? track.album.images[0]?.url : null;
      }),
      catchError((error) => {
        console.error('Erro ao buscar imagem da música no Spotify:', error);
        return of(null);
      })
    );
  }
  searchTracks(query: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.spotifyToken}`,
    });
  
    return this.http
      .get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, { headers })
      .pipe(
        map((response: any) => response.tracks.items), // Acessa a lista de músicas
        catchError(error => {
          console.error('Erro ao buscar músicas:', error);
          return of([]);
        })
      );
  }
  
}
