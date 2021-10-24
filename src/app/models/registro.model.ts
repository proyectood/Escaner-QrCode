export class Registro{
    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor( format: string, text: string){
        this.format = format;
        this.text = text;
        this.created = new Date();

        this.determinarTipo();
    }
    private determinarTipo(){
        const inicioTexto = this.text.substr(0, 4).toLowerCase();
        const inicioTextoMapGoo = this.text.substr(0, 12).toLowerCase();
        if (inicioTextoMapGoo === "https://goo."){
            this.type = 'http';
            this.icon = 'compass-outline';
        }else{
            switch (inicioTexto) {
                case 'http':
                    this.type = 'http';
                    this.icon = 'globe';
                    break;
                case 'geo:':
                    this.type = 'geo';
                    this.icon = 'compass-outline';
                    break;            
                default:
                    this.type = 'No reconocido';
                    this.icon = 'create';
                    break;
            }
        }
    }
}