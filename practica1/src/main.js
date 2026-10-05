import { catalogoInicial } from './data/catalogo.js';
import { vender, mostrarCatalogo } from './reglas.js';
import { iniciarMenu } from './menu.js';

vender(catalogoInicial[9], 1); 
vender(catalogoInicial[1], 1); 
vender(catalogoInicial[0], 2); 
vender(catalogoInicial[3], 4);
vender(catalogoInicial[2], 5); 

mostrarCatalogo(catalogoInicial);

