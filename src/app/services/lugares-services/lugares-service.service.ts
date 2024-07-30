// src/app/services/lugares-services/lugares-service.service.ts
import { Injectable } from '@angular/core';
import { Lugar } from 'src/app/components/models/lugar.interface';
import { Database, ref, set, get, update, remove, push, child } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  private dbRef = ref(this.db, 'lugares');

  constructor(private db: Database) {}

  getLugares(): Promise<Lugar[]> {
    return get(this.dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      } else {
        return [];
      }
    });
  }

  addLugar(lugar: Lugar) {
    const newLugarRef = ref(this.db, `lugares/${lugar.id}`);
    set(newLugarRef, lugar);
  }

  updateLugar(lugar: Lugar) {
    const lugarRef = ref(this.db, `lugares/${lugar.id}`);
    update(lugarRef, lugar);
  }

  addComentario(lugarId: string, usuario: string, comentario: string) {
    const comentarioRef = push(child(ref(this.db), `lugares/${lugarId}/comentarios`));
    set(comentarioRef, { usuario, comentario });
  }

  updateComentario(lugarId: string, comentarioId: string, comentario: string) {
    const comentarioRef = ref(this.db, `lugares/${lugarId}/comentarios/${comentarioId}`);
    update(comentarioRef, { comentario });
  }

  getComentarios(lugarId: string): Promise<any[]> {
    const comentariosRef = ref(this.db, `lugares/${lugarId}/comentarios`);
    return get(comentariosRef).then((snapshot) => {
      if (snapshot.exists()) {
        const comentarios = snapshot.val();
        return Object.keys(comentarios).map(key => ({ id: key, ...comentarios[key] }));
      } else {
        return [];
      }
    });
  }

  removeLugar(id: string) {
    const lugarRef = ref(this.db, `lugares/${id}`);
    return remove(lugarRef);
  }

  clearLugares() {
    remove(this.dbRef);
  }
}
