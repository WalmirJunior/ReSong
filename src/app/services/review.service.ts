import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, query, where, Timestamp, getDocs, getDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

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
      throw new Error('User not authenticated');
    }
  }

  async getUserReviews(userId: string): Promise<any[]> {
    const q = query(this.reviewsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty
      ? []
      : querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
  }

  async getOtherUsersReviews(loggedInUserId: string): Promise<any[]> {
    const q = query(this.reviewsCollection, where('userId', '!=', loggedInUserId));
    const querySnapshot = await getDocs(q);
  
    const reviewsWithUsernames: any[] = [];
  
    for (const doc of querySnapshot.docs) {
      const review: any = doc.data();
      review['id'] = doc.id; // Alteração: usando acesso com ['id']
  
      // Buscar o username com base no campo 'uid' no Firestore
      const usersCollection = collection(this.firestore, 'users');
      const userQuery = query(usersCollection, where('uid', '==', review['userId'])); // Alteração: usando ['userId']
      const userSnapshot = await getDocs(userQuery);
  
      if (!userSnapshot.empty) {
        const userData: any = userSnapshot.docs[0].data();
        review['username'] = userData['username']; // Alteração: usando ['username']
      } else {
        review['username'] = 'Usuário Desconhecido'; // Alteração: usando ['username']
      }
  
      reviewsWithUsernames.push(review);
    }
  
    return reviewsWithUsernames;
  }

  // Método para excluir a review do usuário logado
  async deleteReview(reviewId: string) {
    const user = this.auth.currentUser;
    if (user) {
      try {
        // Obter a referência do documento da review
        const reviewDocRef = doc(this.firestore, 'reviews', reviewId);
        const reviewDoc = await getDoc(reviewDocRef); // Usando getDoc aqui

        const reviewData = reviewDoc.data();

        if (reviewData && reviewData['userId'] === user.uid) { // Alteração: usando a notação ['userId']
          await deleteDoc(reviewDocRef); // Exclui o documento da review
          console.log('Review excluída com sucesso');
        } else {
          throw new Error('Esta review não pertence ao usuário logado');
        }
      } catch (error) {
        console.error('Erro ao excluir review:', error);
        throw error;
      }
    } else {
      throw new Error('Usuário não autenticado');
    }
  }
}
