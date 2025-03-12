document.addEventListener('DOMContentLoaded', function() {
   
    const enableToggle = document.getElementById('enableToggle');
    const displayMode = document.getElementById('displayMode');
    const sensitivity = document.getElementById('sensitivity');
    const resetBtn = document.getElementById('resetBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const statusElement = document.getElementById('status');
    const emotionsContainer = document.getElementById('emotions');
     chrome.storage.sync.get({
      enabled: true,
      displayMode: 'highlight',
      sensitivity: 'medium'
    }, function(items) {
      enableToggle.checked = items.enabled;
      displayMode.value = items.displayMode;
      sensitivity.value = items.sensitivity;
      
      updateUIState(items.enabled);
    });
    
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      
      statusElement.textContent = `Analyzing: ${currentTab.url}`;
      
      
      chrome.tabs.sendMessage(currentTab.id, {action: "getEmotions"}, function(response) {
        if (response && response.emotions) {
          updateEmotionsDisplay(response.emotions);
        } else {
          statusElement.textContent = "No emotional data available yet. Click Analyze Now.";
        }
      });
    });
    
   enableToggle.addEventListener('change', function() {
      const enabled = enableToggle.checked;
      
      chrome.storage.sync.set({enabled: enabled}, function() {
        updateUIState(enabled);
        
        // Send message to content script to update state
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings: {
              enabled: enabled,
              displayMode: displayMode.value,
              sensitivity: sensitivity.value
            }
          });
        });
      });
    });
    
    displayMode.addEventListener('change', function() {
      saveSettings();
    });
    
    sensitivity.addEventListener('change', function() {
      saveSettings();
    });
    
    // Reset button handler
    resetBtn.addEventListener('click', function() {
      const defaultSettings = {
        enabled: true,
        displayMode: 'highlight',
        sensitivity: 'medium'
      };
      
      chrome.storage.sync.set(defaultSettings, function() {
        enableToggle.checked = defaultSettings.enabled;
        displayMode.value = defaultSettings.displayMode;
        sensitivity.value = defaultSettings.sensitivity;
        
        updateUIState(defaultSettings.enabled);
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings: defaultSettings
          });
        });
      });
    });
    
   
    analyzeBtn.addEventListener('click', function() {
      statusElement.textContent = "Analyzing page...";
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'analyze'}, function(response) {
          if (response && response.success) {
            statusElement.textContent = "Analysis complete!";
            if (response.emotions) {
              updateEmotionsDisplay(response.emotions);
            }
          } else {
            statusElement.textContent = "Analysis failed. Please try again.";
          }
        });
      });
    });
    
   function saveSettings() {
      const settings = {
        enabled: enableToggle.checked,
        displayMode: displayMode.value,
        sensitivity: sensitivity.value
      };
      
      chrome.storage.sync.set(settings, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings: settings
          });
        });
      });
    }
    
    function updateUIState(enabled) {
     displayMode.disabled = !enabled;
      sensitivity.disabled = !enabled;
      analyzeBtn.disabled = !enabled;
      
   if (!enabled) {
        statusElement.textContent = "EmotionLens is currently disabled";
      } else {
        statusElement.textContent = "Ready to analyze";
      }
    }
    
    function updateEmotionsDisplay(emotions) {
      
      emotionsContainer.innerHTML = '';
      
     
       const emotionTypes = [
        {name: 'happy', icon: '😊', color: '#4CAF50'},
        {name: 'sad', icon: '😢', color: '#2196F3'},
        {name: 'angry', icon: '😡', color: '#f44336'},
        {name: 'surprise', icon: '😲', color: '#FF9800'},
        {name: 'fear', icon: '😨', color: '#9C27B0'},
        {name: 'disgust', icon: '🤢', color: '#795548'}
      ];
      
      emotionTypes.forEach(emotion => {
        if (emotions[emotion.name] !== undefined) {
          const value = emotions[emotion.name];
          const percentage = Math.round(value * 100);
          
          const emotionElement = document.createElement('div');
          emotionElement.className = 'emotion';
          emotionElement.innerHTML = `
            

            

          `;
          
          emotionsContainer.appendChild(emotionElement);
        }
      });
    }
  });