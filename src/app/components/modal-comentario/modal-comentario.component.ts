// src/app/components/modal-comentario/modal-comentario.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonItem, IonButton, IonTextarea, IonLabel, ModalController } from '@ionic/angular/standalone';
import { LugaresService } from 'src/app/services/lugares-services/lugares-service.service';
import { Lugar } from 'src/app/components/models/lugar.interface';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-modal-comentario',
  templateUrl: './modal-comentario.component.html',
  styleUrls: ['./modal-comentario.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonItem, IonButton, IonTextarea, IonLabel]
})
export class ModalComentarioComponent implements OnInit {
  @Input() lugar!: Lugar;
  @Input() comentarioId?: string;
  @Input() initialComentario: string = '';
  comentario: string = '';

  constructor(
    private lugaresService: LugaresService,
    private modalController: ModalController,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.comentario = this.initialComentario;
  }

  cancel() {
    this.modalController.dismiss();
  }

  async confirm() {
    const currentUser = this.loginService.getCurrentUser();
    if (this.lugar && this.lugar.id && currentUser) {
      if (this.comentarioId) {
        // Editar comentario existente
        await this.lugaresService.updateComentario(this.lugar.id, this.comentarioId, this.comentario);
      } else {
        // Añadir nuevo comentario
        await this.lugaresService.addComentario(this.lugar.id, currentUser.usuario, this.comentario);
      }
      this.modalController.dismiss();
    } else {
      console.error('El lugar o el usuario no están definidos');
    }
  }
}
