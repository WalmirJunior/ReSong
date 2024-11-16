import { Component } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Timestamp } from '@angular/fire/firestore';
import { SpotifyService } from '../services/spotify.service';
import { IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar | undefined;
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedTrack: any;
  reviewText: string = '';
  rating: number = 3;
  myReviews: any[] = [];
  isSearching: boolean = false; // Nova variável para controlar o estado da pesquisa

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private http: HttpClient,
    private spotifyService: SpotifyService
  ) {}
  ionViewDidEnter() {
    this.focusSearchbar(); // Garante que o teclado abre ao carregar a aba
  }
  focusSearchbar() {
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 300); // Adiciona um pequeno atraso para evitar problemas de renderização
  }
  ngOnInit() {
    this.loadMyReviews();
  }

  async searchTracks() {
    if (this.searchQuery.trim() === '') {
      this.dismissSearch(); // Fecha automaticamente se a busca estiver vazia
      return;
    }

    this.isSearching = true; // Ativa o estado de busca
    const apiKey = '30a102a7276dfdd1e9ff99441bdb05b5'; // Substitua pela sua chave da API
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.searchQuery}&api_key=${apiKey}&format=json`;

    this.http.get(url).subscribe((data: any) => {
      this.searchResults = data.results.trackmatches.track;
    });
  }

  dismissSearch() {
    this.isSearching = false; // Sai do modo de pesquisa
    this.searchQuery = ''; // Limpa o campo de busca
    this.searchResults = []; // Reseta os resultados da pesquisa
  }

  selectTrack(track: any) {
    this.selectedTrack = track;
    this.dismissSearch(); // Fecha a pesquisa ao selecionar uma música
  }

  async submitReview() {
    const userId = this.auth.currentUser?.uid;
    if (!userId || !this.selectedTrack) return;
  
    // Obter imagem da música
    const trackImage = await this.spotifyService.getSpotifyTrackImage(this.selectedTrack.name, this.selectedTrack.artist).toPromise();
  
    const reviewData = {
      userId,
      trackId: this.selectedTrack.mbid,
      trackName: this.selectedTrack.name,
      artist: this.selectedTrack.artist,
      reviewText: this.reviewText,
      rating: this.rating,
      trackImage: trackImage, // Salvar a imagem no banco
      timestamp: new Date(),
    };
  
    await addDoc(collection(this.firestore, 'reviews'), reviewData);
    this.reviewText = '';
    this.rating = 3;
    this.selectedTrack = null;
    this.loadMyReviews();
  }
  

  async loadMyReviews() {
    const userId = this.auth.currentUser?.uid;
    if (!userId) return;
  
    const q = query(collection(this.firestore, 'reviews'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    this.myReviews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: (data['timestamp'] as Timestamp).toDate(),
      };
    });
  }
  
}
