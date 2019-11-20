# webpack-workshop

## Introduksjon
I denne workshopen skal vi ta utgangspunkt i webpack for å utforske hva som faktisk skjer når man bygger en frontend. Det er ofte mange forskjellige prosesser koden gjennomgår og ved hjelp av webpack skal vi se på disse gradvis ved å sette opp vår egendefinerte konfigurasjon. Webpack 4 og Parcel gir mye av det vi setter opp manuelt i denne workshopen ut av boksen, men i reelle kundesituasjoner er det vanlig at man likevel må tilføre konfigurasjon manuelt for å få ting til å fungere i kunden sitt miljø.

Vi starter denne workshopen med det aller mest grunnleggende, hvordan webpack bygger en _bundle_ basert på avhengighetene til en angitt fil. Videre vil vi se på ytterligere konfigurasjonsmuligheter, som hvordan vi kan dra nytte av Babel, less, og typescript, ved hjelp av _Loaders_ og _Plugins_. Vi kommer til å utforske forskjellen på produksjonsbygg og bygg best egnet for våre interne og lokale utviklingsmiljøer. Til slutt vil vi se på litt snacks som gjør hverdagen vår som utvikler litt mer behagelig.

## Basic setup
Før vi kommer i gang med webpack skal vi sette opp et minimalt oppsett som vi kan bygge videre fra. Sørg for at du har node og npm installert (https://nodejs.org/en/download/) og klon dette prosjektet: `git clone https://github.com/bekk/webpack-workshop.git`. Kjør `npm install`.
Prosjektet har kun 3 enkle filer `src/index.html`, `src/main.js` og `src/utils.js`. I tillegg til disse filene har vi en mappe kalt _other_ hvor det ligger filer som skal brukes litt senere i workshopen. 
Start med å åpne filen `index.html` direkte i en nettleser. Da ser vi en velkomstmelding generert fra `src/main.js`.

Vi ønsker også å inkludere tid på dagen i velkomstmeldingen.
Dette vil vi løse ved å importere hjelpefunksjonen `getTimeOfDay()`, fra `src/utils.js`, inn til `main.js` og kalle funksjonen.
Dette kommer dessverre til å feile siden nettleseren ikke forstår avhengigheten vi prøver å skape mellom `main.js` og `utils.js`. Dette kan vi løse ved å få webpack til å lage en bundle av de to javascript filene vi trenger.

#### 🏆Oppgave
Legg til rette for å bruke `getTimeOfDay()` i velkomstmeldingen ved å importere den fra `src/utils.js`, inn til `main.js`. Bruk den i velkomstmeldingen som vises, refresh `index.html` og verifiser at du får en feilmelding. Feilmeldingen går ut på at nettleseren ikke forstår import av fil, og gir dermed `syntaxError`. 

<details>
  <summary>🚨Løsningsforslag</summary>

```js
import { getTimeOfDay } from './utils'

  *
  *
  *
  
greetingContent.appendChild(document.createTextNode('Håper du har en fin ' + getTimeOfDay()));
    
```

</details>

Når vi nå har fått denne feilmeldingen skal sette opp webpack i prosjektet vårt. Det første vi gjør er å hente webpack fra NPM. Vi henter også webpack-cli, slik at vi kan bygge koden vår fra kommandolinja.
Kjør `npm i webpack webpack-cli -D`. 
For å bygge filene bruker vi et npm script, som starter webpack og gir den en konfig. 
Legg inn følgende under `script` i `package.json`: `"build": "webpack --config webpack.config.js"`. Opprett filen `webpack.config.js` i rotmappa. I neste avsnitt forklarer vi hvordan vi setter opp denne filen, slik at vi endelig kan vise velkomstmeldingen vår.

### Entry og Output
Når webpack skal bygge en bundle starter den med å se på én fil og basert på denne filen bygger man en avhengighetsgraf. Denne grafen brukes til å finne ut av hvilke andre moduler og biblioteker man er avhengig av. I webpack 4 er default pathen `./src/index.js`, men det er flere måter man kan konfigurere dette på avhengig av hva man er ute etter. Dersom man ønsker et annet entry point kan man skrive:
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
Output definerer hvor man ønsker at webpack skal legge bundelen som produseres og hvordan filene skal navngis. Denne defaulter til `./dist/main.js` for hovedfilen og `./dist` for alle andre genererte filer. Dette kan konfigureres ved å definere et annet navn på output objekt i webpack-konfigen:

```
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
Her definerer `output.path` hvor vi ønsker at bundelen skal legges og `output.filename` definerer navnet.

#### 🏆Oppgave
Lag en webpack-konfig som går ut ifra `main.js` og lager en bundle med alle avhengigheter denne filen har. Endre `index.html` til å peke på bundlen som webpack har bygd for oss. Kjør `npm run build`. Verifiser at du nå har fått en mappe til som heter dist og at det inni denne ligger en js-fil som heter det du satte som filename i webpack-config filen din (feks. `main.bundle.js`.)
Dersom vi nå åpner `index.html` i nettleseren vil vi se en velkomstmelding som også inkluderer tid på dagen.

<details>
  <summary>🚨Løsningsforslag</summary>

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
    	path: path.resolve(__dirname, 'dist'),
	filename: 'main.bundle.js'
    },
};
```

</details>
<br/>

### Dev-server
Å verifisere at konfigurasjonen og koden fungerer kun ved å se at det konstrueres en bundle, for så å måtte finne html-filen og åpne denne i en nettleser, er ikke optimalt. Webpack tilbyr en dev-server som lar oss eksperimentere litt raskere.

Installer webpack-dev-server: `npm install webpack-dev-server -D`. For at det skal være lettere å starte serveren kan det nok en gang være lurt å opprette et script i package.json, f.eks `"dev": "webpack-dev-server --config webpack.config.js"`. Hvis vi kjører dette scriptet ved å kalle `npm run dev`, og går til `http://localhost:8080` i nettleseren, vil vi se en oversikt over mappestrukturen til prosjektet vårt.
Dette skyldes at dev-serveren trenger litt hjelp til å finne ut av hvor den skal laste bundelen vår fra og hvor den statiske html-filen vår skal serves fra.

Vi konfigurer dev-serveren i webpack.config.js-fila. `publicPath` definerer hvor vi kan nå statisk-content fra og `contentBase` forteller webpack hvor kildekoden vår ligger.
Eksempel på dev-server oppsett:
```
    devServer: {
        publicPath: '/',
        contentBase: './src' 
    }
```

#### 🏆Oppgave
Sett opp dev-serveren slik at den får med seg endringer både i javascript og htmlen vår. Refresh nettleseren (localhost-fanen) og se at du igjen får velkomstmeldingen.

<details>
  <summary>🚨Løsningsforslag</summary>

```js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  devServer: {
    publicPath: '/',
    contentBase: './src'
  },
};
    
```
</details>
<br/>

### Developmentbygg og produksjonsbygg
Webpack gir oss optimalisering basert på om et bygg skal brukes under utvikling (av dev-serveren), eller om det skal havne i den endelige produksjonsbundelen. Et developmentbygg fokuserer på rask byggehastighet, mens et produksjonsbygg har som mål å lage en liten bundle.

Vi styrer dette ved å sette `mode` til enten _production_, _development_ eller _none_ i konfig filen.
```
module.exports = {
  mode: 'production'
};
```
Man kan også variere byggmodus som et CLI argument `webpack --mode=production`.

#### 🏆Oppgave
Prøv å bygg både med `mode: 'production'` og `mode: 'development'`, åpne bundlen og se på forskjellen.
Etter det, gjør slik at dev-serveren bruker development, mens bundlen vi bygger bruker production.

<details>
  <summary>🚨Løsningsforslag</summary>

webpack.config.js:
```js
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
	publicPath: '/',
	contentBase: './src'
    },
    mode: 'development',  //eller mode: 'production'
}
```
Kjør npm run build og så se på f.eks størrelsen på filen for hver "mode" dere bygger og åpne opp filen for å se hvordan innholdet i bundelen ser ut for hver mode.

package.json:
```js
"scripts": {
    "build": "webpack --mode=production --config webpack.config.js",
    "dev": "webpack-dev-server --mode=development --config webpack.config.js"
},
```
</details>
<br/>

## Loaders
Webpack forstår i utgangspunktet kun javascript, men ved hjelp av loaders kan vi få webpack til å prosessere forskjellige typer filer. Disse blir da konvertert til moduler som legges til i webpack sitt dependency tre.
Loaders består av to hoveddeler som definerer hvordan de fungerer:
`test`-feltet brukes til å definere hvilke filer som skal identifiseres og transformeres.
`use`-feltet definerer hvillken loader som skal gjøre selve transformeringen. Et grunnleggende eksempel på dette er:

```js
module.exports = {
    output: {
        filename: 'my-first-webpack.bundle.js'
    },
    module: {
        rules: [{ 
            test: /\.txt$/,
            use: 'raw-loader'
        }]
    }
};
```

Her setter man et `rules`-felt som tar en liste med objekter hvor hvert objektet skal ha de obligatoriske feltene `test` og `use`.
Hver gang webpack kommer over en path som viser seg å være en '.txt' så skal man sende denne gjennom 'raw-loader' slik at den kan transformeres før den legges til bundelen. I de neste seksjonene skal vi sette opp litt forskjellige loaders som er veldig vanlige å bruke.

#### 🏆Oppgave
Raw loaderen tar tekstfiler og importerer innholdet rett inn i en string. Last raw loaderen ned ved å kjøre: `npm install raw-loader -S` og bruk den til å importere `tektsfil.txt` som ligger i mappen _other_ som en streng i javascripten deres.

<details>
  <summary>🚨Løsningsforslag</summary>

webpack.config.js:
 ```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
        publicPath: '/',
        contentBase: './src'
    },
    module: {
        rules: [{
            test: /\.txt$/,
            use: 'raw-loader'
        }]
    }
};
```
main.js:
```js
import tekst from './other/tekstfil.txt'

const app = document.getElementById('app');

const tekstfil = document.createElement('p')
tekstfil.appendChild(document.createTextNode(tekst))
app.appendChild(tekstfil);
```

</details>
<br/>

### CSS
En ting vi kan bruke loaders til er å bygge CSS filer inn i bundlen vår. For å få til dette må vi installere loaderen vi ønsker å bruke:
`npm install css-loader -D`. Denne konfigurerer vi på samme måte som 'raw-loader' ved å definere en regel under module.rules:
```js
module: {
    rules: [{
        test: /\.css$/,
        use: 'css-loader'
    }]
}
```
css-loader vil kun legge CSS'en vår inn i en string, så vi trenger også `style-loader` som tar stringen vår med css, og putter det i en _style-tag_ som plasseres i `<head>`.
Installer style-loader ved `npm install style-loader -D`. Siden den skal brukes for samme filer som css-loader, kan vi putte begge loaderne i et array:
```js
    module: {
        rules: [{ 
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
```

#### 🏆Oppgave
Legg til _css-loader_ og _style-loader_ i webpack-konfigen, importer derretter css-fila fra mappen _other_ inn i javascripten din. Verifiser at dev-server har funnet css-fila og at nettsiden nå har fått litt styling.  
Ved å inspisere siden i consolet, ser vi at css'en også ligger i `<head>`.

<details>
  <summary>🚨Løsningsforslag</summary>

webpack.config.js:
 ```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
        contentBase: './src'
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
```
main.js:
```js
import './other/style.css'
```
</details>
<br/>

### Bilder

Bilder er ofte en del av web-applikasjoner og nettsider. For å hente inn bilder trenger vi en file-loader som kan installeres ved å kjøre `npm install file-loader -D`. I CSS avsnittet over viste vi at dersom vi skulle bruke forskjellige loadere på de samme filene kunne vi legge det til i arrayet vi gir til `use`. File loader derimot bruker samme loader på fler fil-typer. Vi må derfor endre `test`-propertien til å teste på flere typer fil-endelser som vist under.

```js
module: {
    rules: [{
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
    }]
}
```

#### 🏆Oppgave
Legg til file-loader i webpack-konfigen, hent bildet `clapping.jpg` fra mappen _other_ inn i javascripten din. Verifiser at du får vist bildet.

<details>
  <summary>🚨Løsningsforslag</summary>
	
webpack.config.js:
 ```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
        contentBase: './src'
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    }
};
```
main.js:
```js
const img = document.createElement("img");
img.src = "./other/clapping.jpg";
app.appendChild(img);
```
</details>
<br/>

### Babel
En av de viktigste transformeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive ES6 og definere polyfills (kode som skal byttes ut med spesifikk annen kode) som blir transpilert til annen versjon av javascript som kan kjøre i et bredere spekter av nettlesere. Kjør følgende kommando for å installere de nødvendige pakkene:
`npm install @babel/core @babel/preset-env babel-loader -D`. Babel core er hovedbiblioteket til babel, preset-env skal vi bruke til å konfigurere opp hva vi vil at babel skal gjøre og loaderen trenger vi for å integrere med webpack. Når disse pakkene er installert kan vi oppdatere webpack-konfigen vår til å inkludere vår nye loader slik:
```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: 'babel-loader'
        }
    ]
}
```
Som vanlig definerer vi `test` og `use`. Test er satt til alle javascript filer, use er fortsatt loaderen vår og `exclude` lar oss spesifisere mapper vi ønsker at denne regelen ikke skal gjelde for. Det er både unødvendig og ineffektivt å transpilere filene i node_modules. Babel konfigureres vanligvis via en .babelrc fil og en av pakkene ovenfor (preset env) skal brukes i konfigen her. Preset env kompilerer koden vår som er ES2015+ kompatibel ned til ES5 kompatibel kode ved å bruke babel plugins og polyfills som kan variere avhengig av browser eller miljø. Den enkleste måte å bruke preset env på er å ha det følgende i .babelrc-filen vår:
```js
{
  "presets": ["@babel/preset-env"]
}
```

#### 🏆Oppgave
Sett opp og sjekk at babel faktisk fungerer. For å gjøre dette kan vi bruke et verktøy som heter ES-Check som kan installeres ved å kjøre `npm install es-check -D`. Lag et npm script som peker programmet på output filen i bundelen din, f.eks: `"check": "es-check es5 ./dist/main.bundle.js"`. Dersom du bruker babel loaderen når du bygger bundelen, burde den passere ES sjekken. Dersom du derimot ikke bruker den burde det kastes en feil.

<details>
  <summary>🚨Løsningsforslag</summary>
	
webpack.config.js:
 ```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
        contentBase: './src'
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
};

    
```
.babelrc i rotmappa:
```js
{
  "presets": ["@babel/preset-env"]
}
```
package.json
```js
"scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpack.config.js",
    "check": "es-check es5 ./dist/main.bundle.js"
},
```
prøv å kjøre `npm run check`--> får feil.
<br />
Kjør `npm run build`
<br />
Kjør `npm run check`--> success 

</details>
<br/>

## Plugins
Der loaders brukes til å gjennomføre en spesifikk transformasjon på visse moduler/filer bruker man webpack plugins for å gjennomføre et bredere spekter av oppgaver. For eksempel bundle-optimaliseringer, ressurshåndtering og miljøvariabler trenger man plugins for å fikse. Mange av disse pluginsene kommer allerede med i en webpack-installasjon og brukes uten at man nødvendigvis tenker over at det er en plugin. 

### Html Webpack Plugin
Selv om html-filen som vi har laget selv fungerer bra, er det enklere om webpack genererer en for oss. HtmlWebpackPlugin genererer rett og slett en standard html-fil med en script tag som linker til bundlen vår, og putter den i output mappen.
Installer HtmlWebpackPlugin(`npm i html-webpack-plugin -D`) og legg til dette i webpack-konfigen:
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```
Dersom vi nå bygger prosjektet vårt med `npm run build`, ser vi at en html-fil også har dukket opp i mappen `/dist`.

Dersom dev-serveren nå benytter den genererte filen, vil vi oppleve at javascript feiler, ettersom den ser etter et element i DOM'en som ikke finnes. Vi løser dette ved å sette html-filen vår som en template. Da vil webpack ta utgangspunkt i denne, og legge til en referanse i javascript-bundlen.
```js
new HtmlWebpackPlugin({ template: './src/index.html' })
```
Husk å fjerne script-taggen fra `src/index.html` slik at vi ikke laster inn vår javascript to ganger.  
HtmlWebpackPlugin kan gjøre veldig mye mer enn vist her, sjekk ut https://github.com/jantimon/html-webpack-plugin for et innblikk i det den kan gjøre.

### Bundle Analyzer
En annen nyttig plugin er [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer). Vi har sett hvordan webpack kan minimize bundlen vår slik at den egner seg bedre for produksjon. Likevel kan det hende at vi fortsatt sitter igjen med en stor bundle. Webpack-bundle-analyzer er et verktøy som lar oss se hvilke pakker bundlen vår inneholder, og hvor stor plass de faktisk tar.
Pluginen starter automatisk i en egen fane når vi kjører dev-serveren etter at vi har installert og konfigurert den.

#### 🏆Oppgave
Legg til `webpack-bundle-analyzer` i prosjektet og konfigurer den i webpack-konfigen.

<details>
    <summary>🚨Løsningsforslag</summary>
    
Etter å ha installert pluginen med `npm i webpack-bundle-analyzer -D` oppdaterer du `webpack.config.js` med følgende verdier:

```js
// Importer webpack-bundle-analyzer øverst i fila
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Legg til pluginen i plugin-lista
module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```
Om vi kjører pluginen ved å starte dev-serveren kan vi se at biblioteket lodash tar veldig mye av den totale bundle størrelsen. Om vi går inn i `src/utils.js` og endrer importen av lodash til å kunne ta inn string delen av biblioteket(`import _ from 'lodash/string';`), kan vi se med webpack-bundle-analyzer at lodash nå tar opp langt mindre plass.

</details>
<br/>


## React
En workshop i react-gruppa er ikke komplett uten at vi får lekt litt med React. Ettersom vi allerede har et babel oppsett gående er det litt mindre som trengs å gjøres enn vanlig. Vi trenger selvsagt React: `npm install --save react react-dom`. Og vi må ha litt mer hjelp til Babel: `npm install @babel/preset-react -D`. Denne pakken lar oss blant annet transformere jsx. 

#### 🏆Oppgave
Lag en React component og rendrer denne i nettsiden din. Husk å koble React på et element i DOMen din.

<details>
<summary>🚨Løsningsforslag</summary>

webpack.config.js:
```js
// Oppdatér module.rules-listen slik at babel-loader også tar .jsx-filer:
{
    test: /\.(js|jsx)$/,
    exclude: /(node_modules)/,
    use: 'babel-loader'
}
```

.babelrc:
```js
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```

main.js:
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import tekst from './other/tekstfil.txt'
import { getTimeOfDay } from './utils';
import './other/style.css'

const App = () => {
    return (
        <>
            <h1>Heisann!</h1>
            <p>Håper du har en fin {getTimeOfDay().toLowerCase()}</p>
            <p>{tekst}</p>
            <img src="./other/clapping.jpg" alt="Klappende smilefjes" />
        </>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

```

</details>

## Typescript
I dag er det stadig mer populært å få typer inn i javascript-verdenen. Den mest direkte måten å gjøre dette på er å introdusere Typescript eller Flow. Dette er ukomplisert nå som webpack-konfigen vår begynner å ta form. Man må selvfølgelig installere typescript med tilhørende ts-loader med `npm install typescript ts-loader -D`. Det vil også kreves en tsconfig.json som for øyeblikket kan være helt tom.

#### 🏆Oppgave
Lag en typescript fil som eksporterer en funksjon, importer den i javascript filen du bruker som inngangspunkt og kall funksjonen fra javascript. 

<details>
<summary>🚨Løsningsforslag</summary>

Opprett tila `tsconfig.json` og legg til følgende:
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "allowSyntheticDefaultImports": true
  }
}
```

webpack.config.js:
````js
// Legg til følgende i module.rules-lista:
{
    test: /\.(ts|tsx)$/,
    exclude: /(node_modules)/,
    use: 'ts-loader'
}
````

Vi har her valgt å lage en React-komponent i Typescript. Opprett fila `src/TypescriptComponent.tsx` og legg til følgende:
```typescript jsx
import React from 'react';

interface Props {
    children: string;
}

const TypescriptComponent = ({ children }: Props) => {
    return (
        <p>{children}</p>
    );
};

export default TypescriptComponent;
```

main.js:
````typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import tekst from './other/tekstfil.txt'
import TestComponent from './TestComponent.tsx';
import { getTimeOfDay } from './utils';
import './other/style.css'

const App = () => {
    return (
        <>
            <h1>Heisann!</h1>
            <p>Håper du har en fin {getTimeOfDay().toLowerCase()}</p>
            <p>{tekst}</p>
            <img src="./other/clapping.jpg" alt="Klappende smilefjes" />
            <TypescriptComponent>Dette er en komponent skrevet i Typescript!</TypescriptComponent>
        </>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
````

Husk å installere typedefinisjonene til React: `npm i @types/react -D`. 

</details>

## Code splitting
Kodesplitting vil si å dele opp koden i flere bundles. Dette vil da gi deg mulighet til å laste bundler etter behov eller i parallell. Ved å gjøre dette kan man optimalisere lastetiden til applikasjonen ved å prioritere hvilken bundle/kode som skal lastes når og at man henter mindre bundler. Kodesplitting kan gjøres på forskjellige måter i webpack: 

### Flere entry points
Man lager en annen start html og legger denne inn som et entry point i webpack.config.js:
```
entry: {
  index: './path/to/my/entry/file.js',
  annen: './path/to/another/entry/file.js',
},
```
Kodesplitting ved et nytt entry point er den enkleste måten å dele opp koden, men i gjengjeld mister man fleksibilitet og man har ingen mulighet til å splitte dynamisk. Det vil også bli duplisert kode dersom de forskjellige modulene er avhengig av de samme pakkene. 

#### Forhindre duplisering av kode:
Dersom man har flere entry point som beskrevet over er det flere muligheter for å forhindre duplisert kode:
* `SplitChunksPlugin`: Legge felles avhengigheter i en egen chunk. Les mer: https://webpack.js.org/plugins/split-chunks-plugin/
* `mini-css-extract-plugin`: Splitte ut css fra applikasjonen. Les mer: https://webpack.js.org/plugins/mini-css-extract-plugin/
* `bundle-loader`: Splitte kode og lazy laste budlene som kommer fra kodesplittingen. Les mer: https://webpack.js.org/loaders/bundle-loader/
* `promise-loader`: Lignende `bundle-loader` men bruker promises. Les mer: https://github.com/gaearon/promise-loader


#### 🏆Oppgave:
Prøv en enkel kodesplitting og sjekk at du får to bundles. 

Opprett en ny js-fil i src-mappa som skriver en hyggelig melding til konsollen, f.eks. `console.log('Selbekk er en helt rå faggruppeleder ❤️')`. Legg denne til i entry-objektet i `module.exports` i webpack-konfigen. Sjekk at du får to bundles i outputen når du bygger prosjektet, i utviklerfanen i nettleseren din eller i BundleAnalyzer-pluginen.

<details>
<summary>🚨Løsningsforslag</summary>

Opprett fila `src/secondary.js` og legg til følgende:
````js
console.log('Selbekk er en helt rå faggruppeleder ❤️')
````

Endre følgende i webpack.config.js:
```js
entry: {
    index: './src/main.js',
    secondary: './src/secondary.js'
},
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
},
```
</details>

### Dynamiske importer

Moduler kan importeres dynamisk ved å bruke `import()`-funksjonen, noe vi skal legge til støtte for i prosjektet vårt nå.

I webpack-konfigurasjonen vår må vi sette opp en chunk-fil, mao. en bundle uten et entry-point:  
```js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js'
    }
};
```
I utils.js filen vi har i prosjektet vårt har vi statisk importert `lodash`, dette skal vi nå endre til en dynamisk hentet avhengigheten. 
```
export function getTimeOfDay() {
  return import("lodash").then(({default: _}) => { 
    const hours = new Date().getHours();
    let timeOfDay = '';
    if (hours > 12) {
        timeOfDay = 'kveld';
    } else if (hours < 12) {
        timeOfDay = 'morgen'
    } else {
        timeOfDay = 'dag';
    }
 
    return _.upperCase(timeOfDay);
 }).catch(error => "Kunne ikke hente lodash – dermed ikke komponenten")
}
```
OBS: Dette returnerer et promise som man må resolve når man henter komponenten. 

```
getTimeOfDay().then(component => {
   // gjør noe med component
})
```
#### 🏆Oppgave 
Hent lodash dynamisk inn i getTimeOfDay komponenten og deretter bygg prosjektet med webpack for å se at `lodash` nå har blitt splittet ut i en egen bundle. 

<details>
<summary>🚨Løsningsforslag</summary>

utils.js:
```js
export function getTimeOfDay() {
    return import('lodash').then(({default: _}) => {
        const hours = new Date().getHours();
        let timeOfDay = '';
        if (hours > 12) {
            timeOfDay = 'kveld';
        } else if (hours < 12) {
            timeOfDay = 'morgen'
        } else {
            timeOfDay = 'dag';
        }

        return _.upperCase(timeOfDay);
    }).catch(error => 'Kunne ikke hente lodash – dermed ikke komponenten')
}
```

main.js
````js
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import tekst from './other/tekstfil.txt'
import TestComponent from './TestComponent.tsx';
import { getTimeOfDay } from './utils';
import './other/style.css'

const App = () => {
    const [timeOfDay, setTimeOfDay] = useState('');

    useEffect(() => {
        getTimeOfDay().then(setTimeOfDay);
    }, []);

    return (
        <>
            <h1>Heisann!</h1>
            <p>Håper du har en fin {timeOfDay.toLowerCase()}</p>
            <p>{tekst}</p>
            <img src="./other/clapping.jpg" alt="Klappende smilefjes" />
            <TestComponent>Dette er en komponent skrevet i Typescript!</TestComponent>
        </>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

````

</details>

## Er du ferdig?
* Sett opp hot reloading for react componenten din. Her burde man introdusere en ny komponent med state og se at state forblir inntakt på tvers av reloads. 
* Les mer om code splitting og prøv å laste kun en bundle først og en annen ved behov. (eks klik på en knapp e.ll)
* Les om webpack konfigurasjonen som nå kommer ut av boksen i webpack 4: https://webpack.js.org/configuration/
* Utforsk mer av webpack: https://webpack.js.org/
* Ta en titt på Parcel og deres Get started guide: https://parceljs.org
