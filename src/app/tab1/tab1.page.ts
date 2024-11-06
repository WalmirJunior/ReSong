import { Component } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedTrack: any;
  reviewText: string = '';
  rating: number = 3;
  myReviews: any[] = [];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private http: HttpClient
  ) {}

  async searchTracks() {
    const apiKey = '30a102a7276dfdd1e9ff99441bdb05b5'; // Substitua pela sua chave da API
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.searchQuery}&api_key=${apiKey}&format=json`;

    this.http.get(url).subscribe((data: any) => {
      this.searchResults = data.results.trackmatches.track;
    });
  }

  selectTrack(track: any) {
    this.selectedTrack = track;
  }

  async submitReview() {
    const userId = this.auth.currentUser?.uid;
    if (!userId || !this.selectedTrack) return;

    const reviewData = {
      userId,
      trackId: this.selectedTrack.mbid,
      trackName: this.selectedTrack.name,
      artist: this.selectedTrack.artist,
      reviewText: this.reviewText,
      rating: this.rating,
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
    this.myReviews = querySnapshot.docs.map(doc => doc.data());
  }

  ngOnInit() {
    this.loadMyReviews();
  }
}
