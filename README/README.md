SUPSI 2022-23  
Corso d’interaction design, CV427.01  
Docenti: A. Gysin, G. Profeta  

Elaborato 3: Manipolazione

# sotto_la_vernice
Autrice: Giorgia Langianese 
[MediaPipe demo-ES6](https://ixd-supsi.github.io/2023/esempi/mp_hands/es6/1_landmarks)


## Introduzione e tema
Per il terzo ed ultimo elaborato il compito consiste nel creare un'interfaccia interattiva che consenta all'utente di interagire utilizzando i movimenti delle proprie mani, sfruttando la tecnologia di visione artificiale. L'utente che utilizza l'interfaccia, una volta attivata la webcam del computer, potrà usufruire della posizione e/o dei movimenti delle proprie mani per interagire e manipolare il programma. Ho deciso di approcciarmi a questo progetto svolgendo una piccola ricerca, poichè volevo approfondire il contesto in cui sarebbe stato sviluppato l'artefatto, ma volevo anche esplorare idee già esistenti e nuove fonti di ispirazione. Ho proceduto, anche grazie alle reference, realizzando diverse prove che portavano a soluzioni differenti, per poi elaborarne solo una che sarà il progetto finale.


## Riferimenti progettuali
 L'informazione raccolta durante le ricerche funge da base solida per sviluppare concetti e soluzioni innovative.


[<img src="doc/reference-02" width="500" alt="Reference-01">]()
[<img src="doc/reference-03" width="500" alt="Reference-02">]()
[<img src="doc/reference-04" width="500" alt="Reference-03">]()


## Design dell’interfraccia e modalià di interazione
L'interfaccia si presenta con una schermata a tinta unita che, evocando un senso di mistero, stimola l'utente a scoprire cosa si cela dietro.
Il programma offre la possibilità di "rimuovere" virtualmente questo strato per rivelare ciò che si trova al di sotto, permettendo agli utenti di apprezzare meglio l'arte impressionista francese e di scoprire cosa si trova al di là della superficie stessa, come dettagli o sfumature che possono sfuggire a una prima occhiata.

L'utente deve avvicinare l'indice e il pollice davanti alla videocamera per attivare la funzione di cancellazione. Quando il gesto viene riconosciuto correttamente, il sistema inizia a rimuovere lo strato superiore dell'opera, rivelando ciò che si trova al di sotto.
Se l'indice e il pollice sono distanti, il sistema non attiva la funzione di cancellazione. Questo significa che l'utente può semplicemente osservare l'opera d'arte senza apportare modifiche. Questo approccio permette di dare il controllo all'utente, consentendo di interagire solo quando si desidera esplorare ulteriormente e scoprire ciò che si cela "sotto la vernice".

Inoltre, il nome "sotto la vernice", suggerisce che ci sia qualcosa di più profondo da scoprire al di là della superficie delle opere d'arte impressioniste francesi, come l'educazione artistica o l'idea che dietro ogni opera d'arte c'è un artista con la propria visione, intenzioni e stile unico.

[<img src="doc/cards.gif" width="500" alt="Magic trick">]()


## Tecnologia usata
Il programma è stato creato utilizzando p5.js, HTML e MediaPipe Hand Landmarker.
Con p5.js e MediaPipe Hand Landmarker, è stato possibile gestire la webcam per il rilevamento dei gesti e l'elaborazione delle immagini. Il linguaggio HTML è stato utilizzato per definire la struttura del programma, mentre il layout e l'organizzazione dei contenuti è stata realizzata sempre con p5.js.


```JavaScript
let capture
let detector

let alphaC;
let layer;
let rad = 50;//diametro del cerchio
let w = innerWidth;
let h = innerHeight;
let s = 'The quick brown fox jumped over the lazy dog.';

let mouseIsDragged = false;

let colors = ["coral", "mediumturquoise", "antiquewhite", "darkred"];

function preload() {
//ho creato un array per la selezione dell'immagine
possible_images = [
	"/immagini/tavole-01.png",
"/immagini/tavole-02.png",
"/immagini/tavole-03.png",
"/immagini/tavole-04.png",
"/immagini/tavole-05.png",
"/immagini/tavole-06.png",
"/immagini/tavole-07.png",
];

var pos = floor(random(possible_images.length));
img = loadImage (possible_images[pos]);
  }

async function setup() {
	pixelDensity(2);



	createCanvas(windowWidth, windowHeight)

  layer = createGraphics(w, h);

	let randomColor = random(colors);

 	layer.fill(randomColor);//colore dello scratch

 	layer.noStroke ()
 	layer.rect(0, 0, width, height);


	capture = createCapture(VIDEO)
	capture.size(640, 480)
	capture.hide()

	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")
}




async function draw() {
  scale(windowWidth/640, windowHeight/480)
	noStroke();
	image(img, 0, 0, width/(windowWidth/640), height/(windowHeight/480));//immagine di sfondo
	image(layer, 0, 0);

	//testi sinistra
	scale(0.6, 0.9);
	textSize(8);
	textAlign(LEFT);
	textFont('monospace');
	text('avvicina indice e pollice destro davanti alla videocamera', 10, 30)
	fill(255, 255, 255);
	

	textSize(8);
	textAlign(LEFT);
	textFont('monospace');
	text('premi "s" per salvare immagine', 10, 40) 
	fill(255, 255, 255);
	

	textSize(8);
	textAlign(LEFT);
	textFont('monospace');
	text('premi "cmnd+r" per caricare un nuovo quadro', 10, 50)
	fill(255, 255, 255);
	

	//testi destra
	textSize(8);
	textAlign(RIGHT);
	textFont('monospace');
	text('progetto realizzato da Giorgia Langianese', 1050, 30)
	fill(255, 255, 255);
	

	textSize(8);
	textAlign(RIGHT);
	textFont('monospace');
	text('SUPSI a.s.22/23', 1050, 40)
	fill(255, 255, 255);
	

	textSize(8);
	textAlign(RIGHT);
	textFont('monospace');
	text('INDEX', 1050, 50)
	fill(255, 255, 255);
  
  

	if (detector && capture.loadedmetadata) {
		const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true })
			
		if (hands.length == 1) {

			const manoA = hands[0]

			const indiceA  = manoA.keypoints[8]
			const polliceA = manoA.keypoints[4]
			
			const indicePollice = dist(indiceA.x, indiceA.y, polliceA.x, polliceA.y)
			
			
			function ciao() {
				for (var x = indiceA.x - rad; x < indiceA.x + rad; x++) {
				  for (var y = indiceA.y - rad; y < indiceA.y + rad; y++) {
					if (dist(x, y, indiceA.x, indiceA.y) < rad && x > 0 && x <= width) {
					  layer.set(x, y, alphaC);
					}
				  }
				}
				layer.updatePixels();
			  }

			if (indicePollice<100){
				ciao()
				// noFill();
    			// ellipse(mouseX, mouseY, rad, rad);
			}
		}
	}
}

async function createDetector() {
	// Configurazione Media Pipe
	// https://google.github.io/mediapipe/solutions/hands
	const mediaPipeConfig = {
		runtime: "mediapipe",
		modelType: "full",
		maxHands: 1,
		solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
	}
	return window.handPoseDetection.createDetector( window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig )
}
```

## Target e contesto d’uso
Il programma è rivolto agli appassionati d'arte, per approfondire la loro conoscenza e interagire con opere d'arte virtuali. Potrebbe essere utilizzato dagli insegnanti per far si che gli studenti abbiano l'opportunità di imparare, in modo coinvolgente e interattivo, l'impressionismo francese e le sue tecniche.
Il programma potrebbe inoltre essere adottato da musei, per offrire un'esperienza interattiva ai visitatori, o può essere utilizzato anche come strumento di apprendimento autonomo.

In generale, il programma mira a coinvolgere e informare gli utenti sull'arte impressionista francese attraverso un'interazione intuitiva e coinvolgente, offrendo un'alternativa digitale all'esplorazione tradizionale delle opere d'arte.

[<img src="doc/munari.jpg" width="300" alt="Supplemento al dizionario italiano">]()
