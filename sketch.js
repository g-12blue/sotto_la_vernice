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

