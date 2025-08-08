// script.js

const words = [
    { word: "Kapsas", sign: "assets/images/kapsas.gif", video: "assets/videos/kapsas.mp4" },
    { word: "Kartul", sign: "assets/images/kartul.gif", video: "assets/videos/kartul.mp4" },
    { word: "Kohv", sign: "assets/images/kohv.gif", video: "assets/videos/kohv.mp4" },
    { word: "Komm", sign: "assets/images/komm.gif", video: "assets/videos/komm.mp4" },
    { word: "Küpsis", sign: "assets/images/küpsis.gif", video: "assets/videos/küpsis.mp4" },
    { word: "Leib", sign: "assets/images/leib.gif", video: "assets/videos/leib.mp4" },
    { word: "Liha", sign: "assets/images/liha.gif", video: "assets/videos/liha.mp4" },
    { word: "Muna", sign: "assets/images/muna.gif", video: "assets/videos/muna.mp4" },
    { word: "Piim", sign: "assets/images/piim.gif", video: "assets/videos/piim.mp4" },
    { word: "Sai", sign: "assets/images/sai.gif", video: "assets/videos/sai.mp4" },
    { word: "Sool", sign: "assets/images/sool.gif", video: "assets/videos/sool.mp4" },
    { word: "Suhkur", sign: "assets/images/suhkur.gif", video: "assets/videos/suhkur.mp4" },
    { word: "Vesi-tee", sign: "assets/images/vesi,-tee.gif", video: "assets/videos/vesi-tee.mp4" },
    { word: "Või", sign: "assets/images/või.gif", video: "assets/videos/või.mp4" },
    { word: "Õun", sign: "assets/images/õun.gif", video: "assets/videos/õun.mp4" },
  ];
  
  // Global array for selected words (used on editing pages)
  let selectedWords = [];
  
  document.addEventListener('DOMContentLoaded', () => {
    // Get the grid container element (present on all pages)
    const gridContainer = document.getElementById('gridContainer');
  
    // Use URL inspection to determine page type.
    const currentURL = window.location.href;
    
    // ----- GRID-EDIT PAGE -----
    if (currentURL.includes('grid-edit.html')) {
      // In grid-edit, the grid size select uses the id "location".
      const gridSizeEl = document.getElementById('location');
      const nextBtnEl = document.getElementById('nextBtn');
      // Word picker and add button should be absent (or hidden) on grid-edit.
      // (If they still exist, we disable/hide them.)
      const wordPickerEl = document.getElementById('wordPicker');
      const addBtnEl = document.getElementById('addBtn');
      const videoPopup = document.getElementById('videoPopup');
      const popupVideo = document.getElementById('popupVideo');
      const closePopup = document.getElementById('closePopup');
  
      if (!gridContainer || !gridSizeEl || !nextBtnEl) {
        console.error('Missing required elements on grid-edit page.');
        return;
      }
      
      // Hide word picker and add button if present.
      if (wordPickerEl) {
        wordPickerEl.disabled = true;
        wordPickerEl.style.display = 'none';
      }
      if (addBtnEl) {
        addBtnEl.style.display = 'none';
      }
      
      // Render grid using the selected grid size.
      function renderGrid() {
        const gridSize = parseInt(gridSizeEl.value);
        gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
        gridContainer.innerHTML = '';
        // Render empty cells.
        for (let i = 0; i < gridSize; i++) {
          const div = document.createElement('div');
          div.className = 'border border-dashed p-4 rounded bg-white text-center shadow';
          div.innerHTML = '<span class="text-gray-400">Sisu puudub</span>';
          gridContainer.appendChild(div);
        }
      }
      
      // Allow grid size changes.
      gridSizeEl.onchange = () => {
        // Reset any selected words (should be empty here).
        selectedWords = [];
        renderGrid();
      };
      
      gridSizeEl.addEventListener('change', function() {
        localStorage.setItem('gridSize', this.value);
      });
      
      // Next button: save grid size and navigate to words-edit.html.
      nextBtnEl.onclick = function() {
        localStorage.setItem('selectedWords', JSON.stringify(selectedWords));
        localStorage.setItem('gridSize', gridSizeEl.value);
        window.location.href = 'words-edit.html';
      };
      
      // Initialize render.
      // If a grid size was saved, restore it.
      const savedGridSize = localStorage.getItem('gridSize');
      if (savedGridSize) {
        gridSizeEl.value = savedGridSize;
      }
      renderGrid();
    }
    
    // ----- WORDS-EDIT PAGE -----
    else if (currentURL.includes('words-edit.html')) {
      // In words-edit, the grid size select has been removed.
      // Retrieve the grid size from localStorage.
      const savedGridSize = localStorage.getItem('gridSize') || '4';
      const gridSize = parseInt(savedGridSize);
      
      // Get the word picker, add button, and next button.
      const wordPickerEl = document.getElementById('wordPicker');
      const addBtnEl = document.getElementById('addBtn');
      const nextBtnEl = document.getElementById('nextBtn');
      const videoPopup = document.getElementById('videoPopup');
      const popupVideo = document.getElementById('popupVideo');
      const closePopup = document.getElementById('closePopup');
  
      if (!gridContainer || !wordPickerEl || !addBtnEl || !nextBtnEl) {
        console.error('Missing required elements on words-edit page.');
        return;
      }
      
      // Populate the word picker dropdown.
      words.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.word;
        opt.textContent = item.word;
        wordPickerEl.appendChild(opt);
      });
      
      // Render grid using the grid size from localStorage.
      function renderGrid() {
        gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
        gridContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
          const div = document.createElement('div');
          div.className = 'border border-dashed p-4 rounded bg-white text-center shadow';
          if (selectedWords[i]) {
            div.innerHTML = `
              <img src="${selectedWords[i].sign}" class="inline-block w-46 h-36 cursor-pointer" onclick="playVideo('${selectedWords[i].video}')">
              <div class="font-semibold">${selectedWords[i].word}</div>
              <button onclick="move(${i}, -1)" class="mt-2 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
              <button onclick="remove(${i})" class="mt-2 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
              <button onclick="move(${i}, 1)" class="mt-2 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            `;
          } else {
            div.innerHTML = '<span class="text-gray-400">Sisu puudub</span>';
          }
          gridContainer.appendChild(div);
        }
      }
      
      // Functions to move and remove words.
      function move(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= selectedWords.length) return;
        [selectedWords[index], selectedWords[newIndex]] = [selectedWords[newIndex], selectedWords[index]];
        renderGrid();
      }
      function remove(index) {
        selectedWords.splice(index, 1);
        renderGrid();
      }
      window.move = move;
      window.remove = remove;
      
      // Video popup functionality.
      window.playVideo = function(src) {
        popupVideo.src = src;
        videoPopup.classList.remove('hidden');
        videoPopup.classList.add('flex');
      }
      if (closePopup) {
        closePopup.onclick = () => {
          videoPopup.classList.add('hidden');
          videoPopup.classList.remove('flex');
          popupVideo.pause();
        };
      } else {
        console.error('Close popup button element not found');
      }
      
      // Enable adding words.
      addBtnEl.onclick = function() {
        const word = wordPickerEl.value;
        if (!word || selectedWords.length >= gridSize) return;
        const foundWord = words.find(w => w.word === word);
        if (foundWord) {
          selectedWords.push(foundWord);
          renderGrid();
        }
      };
      
      // Next button: Save word selection and navigate to save-share.html.
      nextBtnEl.onclick = function() {
        localStorage.setItem('selectedWords', JSON.stringify(selectedWords));
        // Grid size is already saved from grid-edit.
        window.location.href = 'save-share.html';
      };
      
      // Initial render.
      renderGrid();
    }
    
    // ----- SAVE-SHARE PAGE -----
    else if (currentURL.includes('save-share.html')) {
      // In save-share, retrieve saved grid size and selected words.
      const savedGridSize = localStorage.getItem('gridSize') || '4';
      const gridSize = parseInt(savedGridSize);
      const savedSelectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];
      gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
      gridContainer.innerHTML = '';
      
      for (let i = 0; i < gridSize; i++) {
        const div = document.createElement('div');
        div.className = 'border p-4 border-dashed rounded bg-white text-center shadow';
        if (savedSelectedWords[i]) {
          div.innerHTML = `
            <img src="${savedSelectedWords[i].sign}" class="inline-block w-46 h-36 cursor-pointer" onclick="playVideo('${savedSelectedWords[i].video}')">
            <div class="font-semibold">${savedSelectedWords[i].word}</div>
          `;
        } else {
          div.innerHTML = '<span class="text-gray-400">Sisu puudub</span>';
        }
        gridContainer.appendChild(div);
      }
      
      // Setup video popup.
      const popupVideo = document.getElementById('popupVideo');
      const videoPopup = document.getElementById('videoPopup');
      const closePopup = document.getElementById('closePopup');
      window.playVideo = function(src) {
        popupVideo.src = src;
        videoPopup.classList.remove('hidden');
        videoPopup.classList.add('flex');
      }
      if (closePopup) {
        closePopup.onclick = () => {
          videoPopup.classList.add('hidden');
          videoPopup.classList.remove('flex');
          popupVideo.pause();
        };
      }
    }

    // ----- SHARE PAGE -----
    else if (currentURL.includes('share.html')) {
      // Render the same selected images as on save-share page
      const savedGridSize = localStorage.getItem('gridSize') || '4';
      const gridSize = parseInt(savedGridSize);
      const savedSelectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];

      if (!gridContainer) return;

      gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
      gridContainer.innerHTML = '';

      for (let i = 0; i < gridSize; i++) {
        const div = document.createElement('div');
        div.className = 'border p-4 border-dashed rounded bg-white text-center shadow';
        if (savedSelectedWords[i]) {
          div.innerHTML = `
            <img src="${savedSelectedWords[i].sign}" class="inline-block w-46 h-36 cursor-pointer" onclick="playVideo('${savedSelectedWords[i].video}')">
            <div class="font-semibold">${savedSelectedWords[i].word}</div>
          `;
        } else {
          div.innerHTML = '<span class="text-gray-400">Sisu puudub</span>';
        }
        gridContainer.appendChild(div);
      }

      // Setup video popup if present on the page
      const popupVideo = document.getElementById('popupVideo');
      const videoPopup = document.getElementById('videoPopup');
      const closePopup = document.getElementById('closePopup');
      if (popupVideo && videoPopup) {
        window.playVideo = function(src) {
          popupVideo.src = src;
          videoPopup.classList.remove('hidden');
          videoPopup.classList.add('flex');
        }
      }
      if (closePopup) {
        closePopup.onclick = () => {
          videoPopup.classList.add('hidden');
          videoPopup.classList.remove('flex');
          popupVideo.pause();
        };
      }
    }
  });