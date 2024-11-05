import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsCollection;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.reviewsCollection = collection(this.firestore, 'reviews');
  }

  async addReview(musicId: string, musicTitle: string, artist: string, reviewText: string, rating: number) {
    const user = this.auth.currentUser;
    if (user) {
      return await addDoc(this.reviewsCollection, {
        userId: user.uid,
        musicId,
        musicTitle,
        artist,
        reviewText,
        rating,
        timestamp: Timestamp.now(),
      });
    } else {
      throw new Error("User not authenticated");
    }
  }

  async getUserReviews(userId: string) {
    const q = query(this.reviewsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }
}
