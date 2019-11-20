import tekst from './other/tekstfil.txt'
import { getTimeOfDay } from './utils';
import './other/style.css'

const app = document.getElementById('app');

const greetingHeader = document.createElement('h1');
const greetingContent = document.createElement('h3');

greetingHeader.appendChild(document.createTextNode('Heisann!'));
app.appendChild(greetingHeader);

greetingContent.appendChild(document.createTextNode('Håper du har en fin ' + getTimeOfDay().toLowerCase()));
app.appendChild(greetingContent);

const tekstfil = document.createElement('p');
tekstfil.appendChild(document.createTextNode(tekst));
app.appendChild(tekstfil);

const img = document.createElement("img");
img.src = "./other/clapping.jpg";
app.appendChild(img);