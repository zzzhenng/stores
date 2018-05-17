import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import ajaxHeart from './modules/heart';
import searchAhead from './modules/search';

autocomplete($('#address'), $('#lat'), $('#lng'));
searchAhead($('.search'));

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);