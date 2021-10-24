import { Component } from '@angular/core';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from 'src/app/services/data-local.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocal : DataLocalService, public alertCtrl: AlertController) {}

  enviarCorreo(){
    this.dataLocal.enviarCorreo();
  }

  abrirRegistro(registro: Registro) {
    this.dataLocal.abrirRegistro(registro);
  }

  async eliminarRegistros() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Registros',
      message: 'Realmente desea eliminar los registros del historial?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            this.dataLocal.eliminarRegistros();
          }
        }
      ]
    });
    await alert.present();
  }

}
