import { catalogoInicial } from './data/catalogo.js';
import { vender, mostrarCatalogo } from './reglas.js';

vender(catalogoInicial[9], 1); // Tetris
vender(catalogoInicial[1], 1); // Chrono Trigger
vender(catalogoInicial[0], 2); // Super Mario World
vender(catalogoInicial[3], 4); // Sonic the Hedgehog 2
vender(catalogoInicial[2], 5); // Street Fighter II Turbo (no hay stock)

mostrarCatalogo(catalogoInicial);