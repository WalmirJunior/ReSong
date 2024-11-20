import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async registerUser(email: string, password: string, username: string): Promise<any> {
    try {
      const usersRef = collection(this.firestore, 'users');

      // Verifica se o username já existe
      const usernameQuery = query(usersRef, where('username', '==', username));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        throw new Error('O username já está em uso. Escolha outro.');
      }

      // Verifica se o email já existe
      const emailQuery = query(usersRef, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        throw new Error('O email já está em uso. Escolha outro.');
      }

      // Cria o usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Salva o username e email no Firestore
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { email, username });

      return user; // Retorna o usuário criado
    } catch (error) {
      throw error; // Propaga o erro para a página de registro
    }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
