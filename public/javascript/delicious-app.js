import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import ajaxHeart from './modules/heart';

autocomplete($('#address'), $('#lat'), $('#lng'));


const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);