const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const themeToggle = document.querySelector('#themeToggle');
const themeLabel = document.querySelector('#themeLabel');
const savedTheme = localStorage.getItem('windowlight-theme');
if(savedTheme === 'day') document.body.dataset.theme = 'day';

function currentTheme(){
  return document.body.dataset.theme === 'day' ? 'day' : 'night';
}

function updateThemeImages(){
  const theme = currentTheme();
  document.querySelectorAll('[data-day][data-night]').forEach(image => {
    image.src = image.dataset[theme];
  });
}

const randomTriptychImage = document.querySelector('#randomTriptychImage');
const randomTriptych = randomTriptychImage?.closest('.triptych');
const triptychPools = {
  day: [
    {id:'day-original',src:'102.png',width:1687,height:1151,panes:[[2.5,2.5,29.5,95],[35.8,2.5,28.5,95],[68,2.5,29.5,95]]},
    {id:'day-a',src:'103.png',width:2001,height:786,panes:[[3.5,7,20.5,80],[25.2,7,49.2,80],[75.5,7,22.2,80]]},
    {id:'day-b',src:'104.png',width:1254,height:1254,panes:[[8,10.5,28.5,77],[38,10.5,26.5,77],[66,10.5,26.5,77]]},
    {id:'day-c',src:'105.png',width:1672,height:940,panes:[[4,7,29.5,80],[35,7,30,80],[67,7,28,80]]},
    {id:'day-d',src:'106.png',width:1086,height:1448,panes:[[4.5,7.5,30,79],[36,7.5,30,79],[67.5,7.5,28.5,79]]}
  ],
  night: [
    {id:'night-12',src:'107.png',width:1459,height:1534,panes:[[3.7,6.5,27.6,90.5],[37.4,6.5,28.4,90.5],[72,6.5,24.5,90.5]]},
    {id:'night-15',src:'108.png',width:1614,height:1574,panes:[[3.4,3,28.2,66],[36.4,3,27.5,66],[68.5,3,27.8,66]]},
    {id:'night-16',src:'109.png',width:1461,height:1349,panes:[[3.3,2.5,27.5,65],[36.5,2.5,27.2,65],[68.9,2.5,27.8,65]]},
    {id:'night-17',src:'110.png',width:1663,height:1748,panes:[[2.6,2.5,28.5,74],[36.4,2.5,28.4,74],[69.5,2.5,27.7,74]]},
    {id:'night-20',src:'111.png',width:2477,height:2265,panes:[[2.8,2.5,29.2,69],[36.5,2.5,29,69],[70.2,2.5,27,69]]}
  ]
};

function randomizeStoryWindow(){
  if(!randomTriptychImage || !randomTriptych) return;
  const theme = currentTheme();
  const pool = triptychPools[theme];
  const storageKey = `windowlight-story-window-${theme}`;
  const previous = sessionStorage.getItem(storageKey);
  const choices = pool.filter(layout => layout.id !== previous);
  const layout = choices[Math.floor(Math.random()*choices.length)];
  sessionStorage.setItem(storageKey,layout.id);
  randomTriptychImage.src = `images/${layout.src}`;
  randomTriptychImage.alt = `Complete three-pane city window photographed in ${theme === 'day' ? 'daylight' : 'night light'}`;
  randomTriptych.dataset.windowLayout = layout.id;
  randomTriptych.dataset.windowTheme = theme;
  randomTriptych.style.aspectRatio = `${layout.width}/${layout.height}`;
  randomTriptych.style.setProperty('--height-limited-width',`${82*(layout.width/layout.height)}svh`);
  randomTriptych.querySelectorAll('.story-pane').forEach((pane,index) => {
    const [left,top,width,height] = layout.panes[index];
    pane.style.left = `${left}%`;
    pane.style.top = `${top}%`;
    pane.style.width = `${width}%`;
    pane.style.height = `${height}%`;
  });
}

randomizeStoryWindow();
window.addEventListener('pageshow',event => {
  if(event.persisted) randomizeStoryWindow();
});

function syncThemeControl(){
  if(!themeToggle) return;
  const isDay = currentTheme() === 'day';
  themeToggle.setAttribute('aria-pressed', String(isDay));
  themeToggle.setAttribute('aria-label', `Switch to ${isDay ? 'nighttime' : 'daytime'} atmosphere`);
  themeLabel.textContent = isDay ? 'DAY' : 'NIGHT';
  updateThemeImages();
}

syncThemeControl();
themeToggle?.addEventListener('click', () => {
  document.body.dataset.theme = currentTheme() === 'day' ? 'night' : 'day';
  localStorage.setItem('windowlight-theme', currentTheme());
  syncThemeControl();
  randomizeStoryWindow();
});

const facade = document.querySelector('#facade');
if(facade){
  const openCount = document.querySelector('#openCount');
  const openWindows = [];
  const xPositions = [150,729,1289,1841,2401,2945,3495,4048,4604,5151];
  const yPositions = [150,750,1351,1952,2552];
  const canvasWidth = 5692;
  const canvasHeight = 3200;

  for(let i=1;i<=50;i+=1){
    const button = document.createElement('button');
    const number = String(i).padStart(2,'0');
    const column = (i-1)%10;
    const row = Math.floor((i-1)/10);
    const dayImage = `images/${String(i).padStart(3,'0')}.png`;
    const nightImage = `images/${String(i+50).padStart(3,'0')}.png`;
    button.className = 'collection-shutter';
    button.type = 'button';
    button.dataset.number = number;
    button.setAttribute('aria-label', `Reveal city window ${i}`);
    button.setAttribute('aria-pressed','false');
    button.style.left = `${xPositions[column]/canvasWidth*100}%`;
    button.style.top = `${yPositions[row]/canvasHeight*100}%`;
    button.style.width = `${374/canvasWidth*100}%`;
    button.style.height = `${498/canvasHeight*100}%`;
    button.innerHTML = `<img src="${currentTheme() === 'day' ? dayImage : nightImage}" data-day="${dayImage}" data-night="${nightImage}" alt="City window ${number}">`;

    button.addEventListener('click', () => {
      if(button.classList.contains('open')){
        button.classList.remove('open');
        button.setAttribute('aria-pressed','false');
        openWindows.splice(openWindows.indexOf(button),1);
      }else{
        if(openWindows.length === 5){
          const oldest = openWindows.shift();
          oldest.classList.remove('open');
          oldest.setAttribute('aria-pressed','false');
        }
        button.classList.add('open');
        button.setAttribute('aria-pressed','true');
        openWindows.push(button);
      }
      openCount.textContent = `${openWindows.length} / 5`;
    });

    facade.appendChild(button);
  }
}

const computerEntry = document.querySelector('#computerEntry');
const computerDesktop = document.querySelector('#computerDesktop');
const enterComputer = document.querySelector('#enterComputer');
const exitComputer = document.querySelector('#exitComputer');
let desktopLayer = 10;

function showComputer(){
  if(!computerEntry || !computerDesktop) return;
  document.body.classList.add('computer-open');
  computerEntry.hidden = true;
  computerDesktop.hidden = false;
  computerDesktop.querySelector('.desktop-file')?.focus();
}

function syncDesktopWindowState(){
  if(!computerDesktop) return;
  const hasOpenWindow = [...computerDesktop.querySelectorAll('.desktop-window')].some(windowEl => !windowEl.hidden);
  document.body.classList.toggle('desktop-window-open',hasOpenWindow);
}

function hideComputer(){
  if(!computerEntry || !computerDesktop) return;
  computerDesktop.querySelectorAll('.desktop-window').forEach(windowEl => windowEl.hidden = true);
  document.body.classList.remove('computer-open','desktop-window-open');
  computerDesktop.hidden = true;
  computerEntry.hidden = false;
  enterComputer?.focus();
}

enterComputer?.addEventListener('click',showComputer);
exitComputer?.addEventListener('click',hideComputer);

function raiseDesktopWindow(windowEl){
  desktopLayer += 1;
  windowEl.style.zIndex = desktopLayer;
}

document.querySelectorAll('[data-open-window]').forEach(fileButton => {
  fileButton.addEventListener('click',() => {
    const windowEl = document.getElementById(fileButton.dataset.openWindow);
    if(!windowEl) return;
    windowEl.hidden = false;
    raiseDesktopWindow(windowEl);
    syncDesktopWindowState();
    windowEl.querySelector('.window-close')?.focus();
  });
});

document.querySelectorAll('.desktop-window').forEach(windowEl => {
  const bar = windowEl.querySelector('.desktop-window-bar');
  const closeButton = windowEl.querySelector('.window-close');
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  closeButton?.addEventListener('click',() => {
    windowEl.hidden = true;
    syncDesktopWindowState();
    const launcher = document.querySelector(`[data-open-window="${windowEl.id}"]`);
    launcher?.focus();
  });
  windowEl.addEventListener('pointerdown',() => raiseDesktopWindow(windowEl));
  bar?.addEventListener('pointerdown',event => {
    if(event.target.closest('button')) return;
    dragging = true;
    raiseDesktopWindow(windowEl);
    const rect = windowEl.getBoundingClientRect();
    offsetX = event.clientX-rect.left;
    offsetY = event.clientY-rect.top;
    bar.setPointerCapture(event.pointerId);
  });
  bar?.addEventListener('pointermove',event => {
    if(!dragging || !computerDesktop) return;
    const desktopRect = computerDesktop.getBoundingClientRect();
    const maxLeft = Math.max(0,desktopRect.width-windowEl.offsetWidth);
    const maxTop = Math.max(0,desktopRect.height-windowEl.offsetHeight);
    windowEl.style.left = `${clamp(event.clientX-desktopRect.left-offsetX,0,maxLeft)}px`;
    windowEl.style.top = `${clamp(event.clientY-desktopRect.top-offsetY,0,maxTop)}px`;
  });
  bar?.addEventListener('pointerup',() => dragging = false);
  bar?.addEventListener('pointercancel',() => dragging = false);
});

document.querySelectorAll('.move-window').forEach(windowEl => {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  const stageEl = document.querySelector('#moveInteraction');
  const imageEl = stageEl?.querySelector('.interaction-photo');
  function updateView(){
    const stage = stageEl.getBoundingClientRect();
    const rect = windowEl.getBoundingClientRect();
    const x = clamp(rect.left-stage.left,0,stage.width-rect.width);
    const y = clamp(rect.top-stage.top,0,stage.height-rect.height);
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;
    if(imageEl?.naturalWidth && imageEl?.naturalHeight){
      const scale = Math.max(stage.width/imageEl.naturalWidth,stage.height/imageEl.naturalHeight);
      const renderedWidth = imageEl.naturalWidth*scale;
      const renderedHeight = imageEl.naturalHeight*scale;
      const imageX = (stage.width-renderedWidth)/2;
      const imageY = (stage.height-renderedHeight)/2;
      windowEl.style.setProperty('background-size',`${renderedWidth}px ${renderedHeight}px`,'important');
      windowEl.style.setProperty('background-position',`${imageX-x}px ${imageY-y}px`,'important');
    }
  }
  windowEl.addEventListener('pointerdown', event => {
    dragging = true;
    windowEl.setPointerCapture(event.pointerId);
    const rect = windowEl.getBoundingClientRect();
    offsetX = event.clientX-rect.left;
    offsetY = event.clientY-rect.top;
  });
  windowEl.addEventListener('pointermove', event => {
    if(!dragging) return;
    const stage = stageEl.getBoundingClientRect();
    windowEl.style.left = `${event.clientX-stage.left-offsetX}px`;
    windowEl.style.top = `${event.clientY-stage.top-offsetY}px`;
    updateView();
  });
  windowEl.addEventListener('pointerup', () => dragging = false);
  windowEl.addEventListener('keydown', event => {
    const keys = {ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]};
    if(!keys[event.key]) return;
    event.preventDefault();
    const [dx,dy] = keys[event.key];
    windowEl.style.left = `${windowEl.offsetLeft+dx}px`;
    windowEl.style.top = `${windowEl.offsetTop+dy}px`;
    updateView();
  });
  imageEl?.addEventListener('load',updateView);
  imageEl?.decode?.().then(updateView).catch(() => updateView());
  window.addEventListener('load',updateView,{once:true});
  window.addEventListener('resize',updateView);
  requestAnimationFrame(updateView);
});

const scanSurface = document.querySelector('#scanSurface');
const scanLens = document.querySelector('#scanLens');
const scanColor = scanLens?.querySelector('.scan-color');
if(scanSurface && scanLens){
  function positionScan(x,y){
    const rect = scanSurface.getBoundingClientRect();
    x = clamp(x,0,rect.width);
    y = clamp(y,0,rect.height);
    scanLens.style.setProperty('--x',`${x}px`);
    scanLens.style.setProperty('--y',`${y}px`);
    if(scanColor){
      scanColor.style.width = `${rect.width}px`;
      scanColor.style.height = `${rect.height}px`;
      scanColor.style.left = `${-x+scanLens.offsetWidth/2}px`;
      scanColor.style.top = `${-y+scanLens.offsetHeight/2}px`;
    }
    document.querySelectorAll('.scan-word').forEach(word => {
      const centerX = word.offsetLeft+word.offsetWidth/2;
      const centerY = word.offsetTop+word.offsetHeight/2;
      word.style.opacity = Math.abs(centerX-x)<scanLens.offsetWidth/2 && Math.abs(centerY-y)<scanLens.offsetHeight/2 ? '1' : '0';
    });
  }
  function moveScan(event){
    const rect = scanSurface.getBoundingClientRect();
    positionScan(event.clientX-rect.left,event.clientY-rect.top);
  }
  scanSurface.addEventListener('pointermove',moveScan);
  scanSurface.addEventListener('pointerleave',() => document.querySelectorAll('.scan-word').forEach(word => word.style.opacity='0'));
  const centerScan = () => {
    const rect = scanSurface.getBoundingClientRect();
    positionScan(rect.width/2,rect.height/2);
  };
  requestAnimationFrame(centerScan);
  window.addEventListener('resize',centerScan);
}

const refuseSurface = document.querySelector('#refuseSurface');
const refuseMask = refuseSurface?.querySelector('.refuse-mask');
const refuseBlur = refuseMask?.querySelector('.refuse-blur');
if(refuseSurface && refuseMask){
  function positionRefusal(x,y){
    const rect = refuseSurface.getBoundingClientRect();
    x = clamp(x,0,rect.width);
    y = clamp(y,0,rect.height);
    refuseSurface.style.setProperty('--mx',`${x}px`);
    refuseSurface.style.setProperty('--my',`${y}px`);
    if(refuseBlur){
      refuseBlur.style.width = `${rect.width}px`;
      refuseBlur.style.height = `${rect.height}px`;
      refuseBlur.style.left = `${-x+refuseMask.offsetWidth/2}px`;
      refuseBlur.style.top = `${-y+refuseMask.offsetHeight/2}px`;
    }
  }
  refuseSurface.addEventListener('pointermove',event => {
    const rect = refuseSurface.getBoundingClientRect();
    positionRefusal(event.clientX-rect.left,event.clientY-rect.top);
  });
  const centerRefusal = () => {
    const rect = refuseSurface.getBoundingClientRect();
    positionRefusal(rect.width/2,rect.height/2);
  };
  requestAnimationFrame(centerRefusal);
  window.addEventListener('resize',centerRefusal);
}
