// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users'); // Coleção "users" no Firestore
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const q = query(this.usersCollection, where('username', '==', username)); // Busca pelo username no Firestore
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna `true` se o username já existe
  }

  async registerUser(email: string, password: string, username: string): Promise<any> {
    try {
      // Primeiro verifica se o username já está em uso
      const usernameTaken = await this.isUsernameTaken(username);
      if (usernameTaken) {
        throw new Error('O username já está em uso. Escolha outro.');
      }

      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Salva o usuário na coleção "users" do Firestore
      const user = userCredential.user;
      await addDoc(this.usersCollection, {
        uid: user.uid, // ID do usuário no Auth
        email: user.email,
        username: username, // Adiciona o username
        createdAt: new Date(),
      });

      return user; // Retorna o usuário criado
    } catch (error) {
      throw error; // Propaga o erro para tratamento no componente
    }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
