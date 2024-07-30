// src/app/components/modal-insertar/modal-insertar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonItem, IonInput, IonButton, IonTextarea, IonLabel } from '@ionic/angular/standalone';
import { LugaresService } from 'src/app/services/lugares-services/lugares-service.service';
import { Lugar } from 'src/app/components/models/lugar.interface';

@Component({
  selector: 'app-modal-insertar',
  templateUrl: './modal-insertar.component.html',
  styleUrls: ['./modal-insertar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonItem, IonInput, IonButton, IonTextarea, IonLabel]
})
export class ModalInsertarComponent implements OnInit {
  lugar: Lugar = {
    nombre: '',
    enlace: '',
    descripcion: '',
    comentario: ''
  };

  constructor(private lugaresService: LugaresService) { }

  ngOnInit() {}

  cancel() {
    const modal = document.querySelector('ion-modal');
    modal?.dismiss();
  }

  async confirm() {
    // Generar un ID único para el nuevo lugar
    const newLugarId = this.generateId();
    this.lugar.id = newLugarId;

    // Añadir el nuevo lugar a Firebase
    await this.lugaresService.addLugar(this.lugar);
    const modal = document.querySelector('ion-modal');
    modal?.dismiss();
  }

  // Método para generar un ID único
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
