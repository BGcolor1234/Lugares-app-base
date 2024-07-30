// src/app/components/detalles/detalles.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonBackButton, IonImg, IonItemGroup, IonItemDivider, IonLabel, IonModal, ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, chatbox, chatbubbles, create, pencil } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Lugar } from 'src/app/components/models/lugar.interface';
import { ModalComentarioComponent } from 'src/app/components/modal-comentario/modal-comentario.component';
import { ModalEditarComponent } from 'src/app/components/modal-editar/modal-editar.component';
import { LugaresService } from 'src/app/services/lugares-services/lugares-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [IonItem,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonButtons, IonButton, IonBackButton, IonImg, IonItemGroup, IonItemDivider, IonLabel, IonModal, ModalComentarioComponent, ModalEditarComponent]
})
export class DetallesPage implements OnInit {
  lugar: Lugar;
  isAdmin: boolean = false;
  comentarios: any[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private lugaresService: LugaresService,
    private loginService: LoginService,
    private location: Location
  ) { 
    addIcons({ trash, chatbox, chatbubbles, create, pencil });
    const navigation = this.router.getCurrentNavigation();
    this.lugar = navigation?.extras?.state?.['lugar'];
  }

  ngOnInit() {
    this.checkAdmin();
    this.loadComentarios();
  }

  checkAdmin() {
    const currentUser = this.loginService.getCurrentUser();
    if (currentUser) {
      this.isAdmin = currentUser.rol === true;
    }
  }

  async loadComentarios() {
    if (this.lugar && this.lugar.id) {
      this.comentarios = await this.lugaresService.getComentarios(this.lugar.id);
    }
  }

  async openComentarioModal(comentarioId?: string, initialComentario?: string) {
    const modal = await this.modalController.create({
      component: ModalComentarioComponent,
      componentProps: { lugar: this.lugar, comentarioId, initialComentario }
    });
    await modal.present();
    await modal.onWillDismiss(); // Esperar a que el modal se cierre
    this.loadComentarios(); // Cargar comentarios nuevamente después de cerrar el modal
  }

  async openEditarModal() {
    const modal = await this.modalController.create({
      component: ModalEditarComponent,
      componentProps: { lugar: this.lugar }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.lugar = data;
      // Aquí puedes guardar los cambios en tu servicio si es necesario
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Lugar',
      message: '¿Estás seguro de que deseas eliminar este lugar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (this.lugar.id) { // Verifica que el id no sea undefined
              await this.lugaresService.removeLugar(this.lugar.id);
              this.location.back(); // Navegar de vuelta a la lista de lugares después de eliminar
            } else {
              // Maneja el caso donde el id es undefined, por ejemplo mostrando un mensaje de error
              console.error('El ID del lugar es undefined');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  getCurrentUser() {
    return this.loginService.getCurrentUser();
  }
}
