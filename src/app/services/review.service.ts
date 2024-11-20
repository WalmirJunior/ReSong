import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, where, Timestamp, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsCollection;

  constructor(private firestore: Firestore, private auth: Auth) {
    // Cria uma referência à coleção 'reviews' no Firestore
    this.reviewsCollection = collection(this.firestore, 'reviews');
  }

  async addReview(musicId: string, musicTitle: string, artist: string, reviewText: string, rating: number) {
    const user = this.auth.currentUser; // Obtém o usuário autenticado
    if (user) {
      return await addDoc(this.reviewsCollection, {
        userId: user.uid,
        musicId,
        musicTitle,
        artist,
        reviewText,
        rating,
        timestamp: Timestamp.now(), // Marca a data/hora atual
      });
    } else {
      throw new Error("User not authenticated");
    }
  }

  async getUserReviews(userId: string): Promise<any[]> {
    const q = query(this.reviewsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Retorna um array vazio caso não haja resultados
    return querySnapshot.empty
      ? []
      : querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Inclui o ID do documento
        }));
  }

  // Novo método para buscar reviews de outros usuários
  async getOtherUsersReviews(loggedInUserId: string): Promise<any[]> {
    const q = query(this.reviewsCollection, where("userId", "!=", loggedInUserId));
    const querySnapshot = await getDocs(q);

    // Retorna um array vazio caso não haja resultados
    return querySnapshot.empty
      ? []
      : querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Inclui o ID do documento
        }));
  }
}
