import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  registros: Registro[] = [];

  constructor(private storage: Storage, private navCtrl: NavController, private iab: InAppBrowser, private file: File,
              private emailComposer: EmailComposer, public alertCtrl: AlertController) {
    this.initDB(); 
    this.cargarRegistros();
  }

  async initDB(){
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async cargarRegistros(){
    // const registrosDB = await this.storage.get('registros');
    // this.registros = registrosDB || [];
    // return this.registros;
    this.registros = await this.storage.get('registros') || [];
  }

  async guardarRegistro( format: string, text: string){
    await this.cargarRegistros();
    const nuevoRegistro = new Registro(format, text);
    this.registros.unshift(nuevoRegistro);
    this.storage.set('registros', this.registros);
    console.log(this.registros);
    this.abrirRegistro( nuevoRegistro );
  }

  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');
    switch (registro.type) {
      case 'http':
          this.iab.create(registro.text, '_system');
        break;
      case 'geo':
          this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
        break;
      default:
          this.mensajeAlert(registro.text);
        break;
    }
  }

  eliminarRegistros(){
    this.registros = [];
    this.storage.set('registros', this.registros);
  }

  enviarCorreo(){
    const arrTmp = [];
    const titulos = 'Tipo,Formato,Creacion,Url\n';
    arrTmp.push(titulos);
    this.registros.forEach( registro => {
      const linea = `${ registro.type },${ registro.format },${ registro.created },${ registro.text.replace(',',' ') }\n`;
      arrTmp.push(linea);
    });
    console.log('Data para enviar',arrTmp.join(''));
    this.crearArchivoCsv(arrTmp.join(''));
  }

  crearArchivoCsv(datos: string){
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' ).then( existe => {
      console.log('Existe ya el archivo csv?', existe);
      return this.escribirArchivo( datos );
    }).catch( err => {
      return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
      .then( creado => this.escribirArchivo(datos) )
      .catch( err2 => console.log('No se pudo crear archivo.', err2) );
    });
  }

  async escribirArchivo(datos: string){
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', datos );
    const archivo = `${this.file.dataDirectory}registros.csv`;
    const email = {
      to: 'leonardorazon_88@hotmail.com',
      //cc: '',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        // 'file://img/logo.png',
        // 'res://icon.png',
        // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        // 'file://README.pdf'
        archivo
      ],
      subject: 'Registros escaneados',
      body: 'Estos son los registros de escaneos de Codigos QR guardados en la app.',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  async mensajeAlert(mensajeCodeQR: string){
    const alert = await this.alertCtrl.create({
      header: 'Informacion',
      message: mensajeCodeQR,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}

