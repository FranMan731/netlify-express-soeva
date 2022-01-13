//============================
//  PUERTO
//============================
process.env.PORT = process.env.PORT || 5000;

//============================
//  ENTORNO
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
//  Base de Datos
//============================

let urlDB = 'mongodb+srv://soevaadmin:soevaadmin321@soevadb.wmsry.mongodb.net/test';

/*if(process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017';
} else {
    
	//urlDB = 'mongodb+srv://admin:admin123456@cluster0.wmsry.mongodb.net/swigtime?retryWrites=true&w=majority';
}*/

process.env.URLDB = urlDB;
process.env.NAME_DB = "soeva";

//============================
//  Secret Token
//============================
process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || "clave_secreta_de_app_soeva_desarrollada";