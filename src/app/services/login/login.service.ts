// src/app/services/login/login.service.ts
import { Injectable } from '@angular/core';
import { Database, ref, get, query, orderByChild, equalTo, set } from '@angular/fire/database';
import { Usuario } from 'src/app/components/models/usuario.inteface'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser: Usuario | null = null;

  constructor(private db: Database, private router: Router) { 
    this.loadCurrentUser();
  }

  async register(correo: string, contrasena: string, usuario:string): Promise<void> {
    // Verifica si el usuario ya existe
    const userRef = query(ref(this.db, 'usuarios'), orderByChild('correo'), equalTo(correo));
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      throw new Error('El usuario ya existe');
    }

    const newUser: Usuario = {
      id: this.generateId(),
      correo: correo,
      contrasena: contrasena,
      usuario:usuario,
      rol: false // Registro de usuarios normales
    };

    // Agrega el nuevo usuario a la base de datos
    const newUserRef = ref(this.db, `usuarios/${newUser.id}`);
    await set(newUserRef, newUser);
  }

  async login(correo: string, contrasena: string): Promise<void> {
    const userRef = query(ref(this.db, 'usuarios'), orderByChild('correo'), equalTo(correo));
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const userId = Object.keys(users)[0];
      const user: Usuario = users[userId];

      if (user.contrasena === contrasena) {
        // Autenticación exitosa
        this.currentUser = user;
        this.saveCurrentUser();

        if (user.rol) {
          // Redirige a la página de administrador
          this.router.navigate(['/lugares']);
        } else {
          // Redirige a la página de usuario
          this.router.navigate(['/lugares']);
        }
      } else {
        throw new Error('Contraseña incorrecta');
      }
    } else {
      throw new Error('Usuario no encontrado');
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUser;
  }

  private saveCurrentUser(): void {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
