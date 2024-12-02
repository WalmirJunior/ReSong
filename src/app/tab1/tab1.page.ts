import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, where, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { SpotifyService } from '../services/spotify.service';
import { ModalSearchComponent } from '../modal-search/modal-search.component';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  selectedTrack: any;
  reviewText: string = '';
  rating: number = 3;
  myReviews: any[] = [];
  private authStateListener: any;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private modalController: ModalController,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    this.authStateListener = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loadMyReviews();
      } else {
        this.myReviews = [];
      }
    });

    this.loadMyReviews();
  }

  ngOnDestroy() {
    if (this.authStateListener) {
      this.authStateListener();
    }
  }

  // Abre o modal de pesquisa
  async openSearchModal() {
    const modal = await this.modalController.create({
      component: ModalSearchComponent,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedTrack = result.data; // Armazena a música selecionada
        console.log('Música selecionada:', this.selectedTrack);
      }
    });
  
    return await modal.present();
  }
  

  async submitReview() {
    const userId = this.auth.currentUser?.uid;
    if (!userId || !this.selectedTrack) return;
  
    // Obter imagem da música (opcional)
    const trackImage = await this.spotifyService
      .getSpotifyTrackImage(this.selectedTrack.name, this.selectedTrack.artist)
      .toPromise();
  
      const reviewData = {
        userId,
        trackId: this.selectedTrack.trackId, // ID da música
        trackName: this.selectedTrack.name, // Nome da música
        artist: this.selectedTrack.artist, // Artista
        reviewText: this.reviewText, // Texto da review
        rating: this.rating, // Avaliação
        trackImage: trackImage || this.selectedTrack.albumImage, // Imagem da música
        timestamp: Timestamp.now(), // Usando Timestamp.now() para armazenar a data/hora no formato correto
      };
      
  
    // Salvar a review no Firestore
    await addDoc(collection(this.firestore, 'reviews'), reviewData);
  
    // Limpar os campos
    this.reviewText = '';
    this.rating = 3;
    this.selectedTrack = null;
    this.loadMyReviews(); // Atualiza as reviews após enviar uma nova
  }
  

  async loadMyReviews() {
    const userId = this.auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(this.firestore, 'reviews'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    this.myReviews = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: (data['timestamp'] as Timestamp).toDate(),
      };
    });
  }

  async deleteReview(reviewId: string) {
    try {
      const reviewDocRef = doc(this.firestore, 'reviews', reviewId);
      await deleteDoc(reviewDocRef);
      this.myReviews = this.myReviews.filter((review) => review.id !== reviewId);
    } catch (error) {
      console.error('Erro ao excluir a review:', error);
    }
  }
}
