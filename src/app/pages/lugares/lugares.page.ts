// src/app/components/lugares/lugares.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonApp, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, IonModal, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplane, addCircle } from 'ionicons/icons';
import { ModalInsertarComponent } from 'src/app/components/modal-insertar/modal-insertar.component';
import { LugaresService } from 'src/app/services/lugares-services/lugares-service.service'; 
import { LoginService } from 'src/app/services/login/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { Lugar } from 'src/app/components/models/lugar.interface';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
  standalone: true,
  imports: [ModalInsertarComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonButtons, IonButton, IonApp, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, IonModal]
})
export class LugaresPage implements OnInit {
  isModalOpen: boolean = false;
  lugares: Lugar[] = [];
  isAdmin: boolean = false;

  constructor(
    private lugaresService: LugaresService, 
    private router: Router, 
    private modalController: ModalController,
    private loginService: LoginService // Inyecta el LoginService para obtener el rol del usuario
  ) { 
    addIcons({ airplane, addCircle });

    // Suscribirse a eventos de navegación para actualizar la lista al volver a la página
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadLugares();
    });
  }

  ngOnInit() {
    this.loadLugares();
    this.checkAdmin(); // Verifica el rol del usuario al inicializar
  }

  async loadLugares() {
    this.lugares = await this.lugaresService.getLugares();
  }

  async onWillDismiss(event: any) {
    this.isModalOpen = false;
    this.lugares = await this.lugaresService.getLugares(); // Actualizar la lista cuando se cierra el modal
  }

  goToDetails(lugar: Lugar) {
    this.router.navigate(['/detalles'], { state: { lugar } });
  }

  async openInsertarModal() {
    const modal = await this.modalController.create({
      component: ModalInsertarComponent
    });
    
    modal.onWillDismiss().then(() => {
      this.onWillDismiss(null);
    });

    await modal.present();
  }

  checkAdmin() {
    const currentUser = this.loginService.getCurrentUser();
    if (currentUser) {
      this.isAdmin = currentUser.rol === true;
    }
  }
}
