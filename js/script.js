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
  
  // Global array for selected words (only used on editing pages)
  let selectedWords = [];
  
  document.addEventListener('DOMContentLoaded', () => {
    // Try to get the grid container element
    const gridContainer = document.getElementById('gridContainer');
  
    // If gridContainer exists but gridSize is missing, assume we are on save-share.html
    const gridSizeEl = document.getElementById('gridSize');
  
    if (gridSizeEl) {
      // We are on an editing page (either grid-edit.html or words-edit.html)
      const wordPickerEl = document.getElementById('wordPicker');
      const addBtnEl = document.getElementById('addBtn');
      const nextBtnEl = document.getElementById('nextBtn');
      const videoPopup = document.getElementById('videoPopup');
      const popupVideo = document.getElementById('popupVideo');
      const closePopup = document.getElementById('closePopup');
  
      // Check for required editing elements
      if (!wordPickerEl || !gridContainer || !addBtnEl || !nextBtnEl) {
        console.error('One or more required editing elements are missing.');
        return;
      }
  
      // Populate word picker dropdown
      words.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.word;
        opt.textContent = item.word;
        wordPickerEl.appendChild(opt);
      });
  
      // Render grid based on grid size and selected words
      function renderGrid() {
        const gridSize = parseInt(gridSizeEl.value);
        // If gridSize is 4 or less, use that as number of columns; otherwise default to 4 columns.
        gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
        gridContainer.innerHTML = '';
  
        for (let i = 0; i < gridSize; i++) {
          const div = document.createElement('div');
          div.className = 'border p-4 rounded bg-white text-center shadow';
  
          if (selectedWords[i]) {
            div.innerHTML = `
              <img src="${selectedWords[i].sign}" class="inline-block w-46 h-36 cursor-pointer" onclick="playVideo('${selectedWords[i].video}')">
              <div class="font-semibold">${selectedWords[i].word}</div>
              <button onclick="move(${i}, -1)" class="mt-2 px-2 bg-gray-200 rounded">←</button>
              <button onclick="remove(${i})" class="mt-2 px-2 bg-red-300 rounded">–</button>
              <button onclick="move(${i}, 1)" class="mt-2 px-2 bg-gray-200 rounded">→</button>
            `;
          } else {
            div.innerHTML = '<span class="text-gray-400">Empty</span>';
          }
  
          gridContainer.appendChild(div);
        }
      }
  
      // Move a selected word within the array
      function move(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= selectedWords.length) return;
        [selectedWords[index], selectedWords[newIndex]] = [selectedWords[newIndex], selectedWords[index]];
        renderGrid();
      }
  
      // Remove a word from the selection
      function remove(index) {
        selectedWords.splice(index, 1);
        renderGrid();
      }
  
      // Expose move and remove for inline button handlers
      window.move = move;
      window.remove = remove;
  
      // Video popup functionality
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
  
      // Add word when "Add" is clicked
      addBtnEl.onclick = function() {
        const word = wordPickerEl.value;
        if (!word || selectedWords.length >= parseInt(gridSizeEl.value)) return;
        const foundWord = words.find(w => w.word === word);
        if (foundWord) {
          selectedWords.push(foundWord);
          renderGrid();
        }
      };
  
      // Reset selection when grid size changes
      gridSizeEl.onchange = () => {
        selectedWords = [];
        renderGrid();
      };
  
      // Determine next page based on current page URL:
      // - On grid-edit.html, go to words-edit.html.
      // - On words-edit.html, go to save-share.html.
      let nextPage = 'save-share.html';
      if (window.location.href.includes('grid-edit.html')) {
        nextPage = 'words-edit.html';
      } else if (window.location.href.includes('words-edit.html')) {
        nextPage = 'save-share.html';
      }
  
      // Next button: Save current settings and navigate to the next page.
      nextBtnEl.onclick = function() {
        localStorage.setItem('selectedWords', JSON.stringify(selectedWords));
        localStorage.setItem('gridSize', gridSizeEl.value);
        window.location.href = nextPage;
      };
  
      // Restore previously saved grid size if available
      const savedGridSize = localStorage.getItem('gridSize');
      if (savedGridSize) {
        gridSizeEl.value = savedGridSize;
      }
  
      // Update localStorage when grid size changes
      gridSizeEl.addEventListener('change', function() {
        localStorage.setItem('gridSize', this.value);
      });
  
      // Initial grid render
      renderGrid();
  
    } else if (gridContainer) {
      // If gridSize is missing but gridContainer is present, we assume this is save-share.html.
      const savedGridSize = localStorage.getItem('gridSize');
      const savedSelectedWords = JSON.parse(localStorage.getItem('selectedWords')) || [];
      const gridSize = parseInt(savedGridSize) || 4; // Default to 4 columns if not set.
  
      gridContainer.className = `grid gap-2 grid-cols-${gridSize <= 4 ? gridSize : 4}`;
      gridContainer.innerHTML = '';
  
      for (let i = 0; i < gridSize; i++) {
        const div = document.createElement('div');
        div.className = 'border p-4 rounded bg-white text-center shadow';
  
        if (savedSelectedWords[i]) {
          div.innerHTML = `
            <img src="${savedSelectedWords[i].sign}" class="inline-block w-46 h-36 cursor-pointer" onclick="playVideo('${savedSelectedWords[i].video}')">
            <div class="font-semibold">${savedSelectedWords[i].word}</div>
          `;
        } else {
          div.innerHTML = '<span class="text-gray-400">Empty</span>';
        }
  
        gridContainer.appendChild(div);
      }
  
      // Setup video popup on save-share page if present.
      const videoPopup = document.getElementById('videoPopup');
      const popupVideo = document.getElementById('popupVideo');
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
  });