document.addEventListener('DOMContentLoaded', () => {
  const fretboard = document.getElementById('fretboard');
  const instrumentSelector = document.getElementById('instrument-selector');

  const instrumentDefinitions = {
    '6-string-guitar': { stringPositions: [1, 2, 3, 4, 5, 6] },
    '4-string-bass':   { stringPositions: [2, 3, 4, 5] },    // 4 middle strings
    '5-string-bass':   { stringPositions: [2, 3, 4, 5, 6] }, // bottom 5 strings
    '6-string-bass':   { stringPositions: [1, 2, 3, 4, 5, 6] },
  };

  let currentInstrument = '6-string-guitar';
  const fretboardWidth = 800;

  function drawFretboard(instrumentType) {
    const instrument = instrumentDefinitions[instrumentType];
    if (!instrument || !instrument.stringPositions) {
      console.error('Invalid instrument type:', instrumentType);
      return;
    }

    const stringPositions = instrument.stringPositions;
    const numFrets = 24;
    const fretboardHeight = 200;
    const stringSpacing = fretboardHeight / 7;
    const nutPosition = 50;

    fretboard.innerHTML = '';
    fretboard.setAttribute('height', fretboardHeight);
    fretboard.setAttribute('width', fretboardWidth);

    // Create defs element for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Define gradient for fretboard background (metallic black)
    const fretboardGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    fretboardGradient.setAttribute('id', 'fretboardGradient');
    fretboardGradient.setAttribute('x1', '0%');
    fretboardGradient.setAttribute('y1', '0%');
    fretboardGradient.setAttribute('x2', '0%');
    fretboardGradient.setAttribute('y2', '100%');

    const fbStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    fbStop1.setAttribute('offset', '0%');
    fbStop1.setAttribute('stop-color', '#1a1a1a');

    const fbStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    fbStop2.setAttribute('offset', '100%');
    fbStop2.setAttribute('stop-color', '#000000');

    fretboardGradient.appendChild(fbStop1);
    fretboardGradient.appendChild(fbStop2);
    defs.appendChild(fretboardGradient);

    fretboard.appendChild(defs);

    // Add background rectangle
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.setAttribute('width', fretboardWidth);
    bgRect.setAttribute('height', fretboardHeight);
    bgRect.setAttribute('fill', 'url(#fretboardGradient)');
    fretboard.appendChild(bgRect);

    const yPositions = stringPositions.map(pos => pos * stringSpacing);

    const firstStringY = Math.min(...yPositions);
    const lastStringY = Math.max(...yPositions);
    const usableFretboardHeight = lastStringY - firstStringY;
    const fretWidth = (fretboardWidth - nutPosition) / (numFrets + 1);
    const lastFretX = nutPosition + numFrets * fretWidth;

    const fretColor = 'lightgrey'; // Set fret and string color to light grey

    // Draw strings
    yPositions.forEach(y => {
      const stringLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      stringLine.setAttribute('x1', String(nutPosition));
      stringLine.setAttribute('y1', String(y));
      stringLine.setAttribute('x2', String(lastFretX));
      stringLine.setAttribute('y2', String(y));
      stringLine.setAttribute('stroke', fretColor);
      stringLine.setAttribute('stroke-width', '2');
      fretboard.appendChild(stringLine);
    });

    // Draw frets
    for (let i = 1; i <= numFrets; i++) {
      const x = nutPosition + i * fretWidth;
      const fretLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      fretLine.setAttribute('x1', String(x));
      fretLine.setAttribute('y1', String(firstStringY));
      fretLine.setAttribute('x2', String(x));
      fretLine.setAttribute('y2', String(lastStringY));
      fretLine.setAttribute('stroke', fretColor);
      fretLine.setAttribute('stroke-width', '2');
      fretboard.appendChild(fretLine);
    }

    // Draw the nut
    const nutRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    nutRect.setAttribute('x', String(nutPosition - 4));
    nutRect.setAttribute('y', String(firstStringY));
    nutRect.setAttribute('width', '4');
    nutRect.setAttribute('height', String(usableFretboardHeight));
    nutRect.setAttribute('fill', fretColor);
    fretboard.appendChild(nutRect);
  }

  instrumentSelector.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      currentInstrument = event.target.dataset.instrument;
      drawFretboard(currentInstrument);

      const buttons = instrumentSelector.querySelectorAll('button');
      buttons.forEach(btn => btn.classList.remove('active'));

      event.target.classList.add('active');
    }
  });

  const tabs = document.querySelectorAll('#tabs .tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabContents.forEach(content => content.classList.remove('active'));
      const contentId = tab.dataset.tab + '-content';
      document.getElementById(contentId).classList.add('active');
    });
  });

  drawFretboard(currentInstrument);

  const appTitle = document.getElementById('app-title');
  appTitle.style.width = `${fretboardWidth}px`;

  const tabsSection = document.getElementById('tabs-section');
  tabsSection.style.width = `${fretboardWidth}px`;

  const fretboardSection = document.getElementById('fretboard-section');
  fretboardSection.style.width = `${fretboardWidth}px`;

  const jmsTitle = document.getElementById('jms-title');
  jmsTitle.style.fontSize = '1.1em';

  const initialButton = instrumentSelector.querySelector(`button[data-instrument="${currentInstrument}"]`);
  if (initialButton) {
    initialButton.classList.add('active');
  }
});