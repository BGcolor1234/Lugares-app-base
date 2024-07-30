// src/app/pages/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonCheckbox, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonCheckbox, IonCol, IonRow, IonText]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: LoginService) { }

  ngOnInit() {
    console.log('Login page initialized');
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
    } catch (error) {
      console.error('Error during login:', (error as Error).message);
      // Maneja el error, por ejemplo mostrando un mensaje al usuario
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Asegúrate de tener la ruta '/register' configurada
  }
}
