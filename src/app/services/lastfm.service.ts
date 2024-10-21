import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  private apiKey: string = '30a102a7276dfdd1e9ff99441bdb05b5';  // Substitua pela sua API key
  private apiUrl: string = 'http://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient) { }

  // Método para buscar informações de um artista
  getArtistInfo(artistName: string): Observable<any> {
    const url = `${this.apiUrl}?method=artist.getinfo&artist=${artistName}&api_key=${this.apiKey}&format=json`;
    return this.http.get(url);
  }

  // Outros métodos para buscar álbuns, músicas, etc. podem ser adicionados aqui
}
