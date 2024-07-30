export interface Usuario {
  id?: string;
  correo: string;
  contrasena: string;
  usuario:string;
  rol?: boolean; // false para usuarios, true para administradores
}
