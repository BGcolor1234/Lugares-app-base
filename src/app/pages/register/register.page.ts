// src/app/pages/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonCheckbox, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonCheckbox, IonCol, IonRow, IonText]
})
export class RegisterPage implements OnInit {
  email: string = '';
  password: string = '';
  usuario: string =  '';

  constructor(private router: Router, private authService: LoginService) { }

  ngOnInit() {
    console.log('Register page initialized');
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password, this.usuario);
      this.router.navigate(['/login']); // Redirige al login después del registro exitoso
    } catch (error) {
      console.error('Error during registration:', (error as Error).message);
      // Maneja el error, por ejemplo mostrando un mensaje al usuario
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Asegúrate de tener la ruta '/login' configurada
  }
}
