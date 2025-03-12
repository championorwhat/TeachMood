let settings = {
    enabled: true,
    displayMode: 'highlight',
    sensitivity: 'medium'
  };
  
  let emotionalData = {
    happy: 0.2,
    sad: 0.1,
    angry: 0.05,
    surprise: 0.15,
    fear: 0.05,
    disgust: 0.03
  };
  
  let highlightedElements = [];
  let overlayElement = null;
  let sidebarElement = null;
  
 
  (function() {
    loadSettings();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "analyze") {
          console.log("Analyzing emotions...");
          sendResponse({ success: true, emotions: { happy: 0.8, sad: 0.2 } });
      }
  });
  
    

    chrome.runtime.onMessage.addListener(handleMessages);
  })();
  

  function loadSettings() {
    chrome.storage.sync.get({
      enabled: true,
      displayMode: 'highlight',
      sensitivity: 'medium'
    }, function(items) {
      settings = items;
      
     
      if (settings.enabled) {
        setTimeout(analyzePageEmotions, 1000); 
      }
    });
  }
  

  function handleMessages(message, sender, sendResponse) {
    switch (message.action) {
      case 'updateSettings':
        settings = message.settings;
        updateDisplay();
        sendResponse({success: true});
        break;
        
      case 'analyze':
        analyzePageEmotions();
        sendResponse({success: true, emotions: emotionalData});
        break;
        
      case 'getEmotions':
        sendResponse({emotions: emotionalData});
        break;
        
      default:
        sendResponse({success: false, error: 'Unknown action'});
    }
    
    return true; 
  }
  

  function analyzePageEmotions() {
    if (!settings.enabled) return;
    
   
    clearDisplayElements();
    

    const textElements = getTextElements();
    
   
    resetEmotionalData();
    
   
    textElements.forEach(element => {
      const text = element.textContent.trim();
      if (text.length > 10) { // Only analyze substantial text
        const emotions = analyzeText(text);
        updateEmotionalData(emotions);
        
       
        if (shouldHighlight(emotions)) {
          highlightElement(element, emotions);
        }
      }
    });
    
    
    updateDisplay();
    
    
    chrome.runtime.sendMessage({
      action: 'analysisComplete',
      url: window.location.href,
      emotions: emotionalData
    });
  }
  
 
  function getTextElements() {
    
    return Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, div > span'));
  }
  
 
  function resetEmotionalData() {
    emotionalData = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprise: 0,
      fear: 0,
      disgust: 0
    };
  }
  
  
  function analyzeText(text) {
    
    const emotions = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprise: 0,
      fear: 0,
      disgust: 0
    };
    
    
    const happyWords = ['happy', 'joy', 'excellent', 'great', 'wonderful', 'love', 'amazing', 'smile'];
   
    const sadWords = ['sad', 'unhappy', 'disappointed', 'sorry', 'regret', 'miss', 'cry'];
   
    const angryWords = ['angry', 'mad', 'furious', 'hate', 'rage', 'upset', 'irritated'];
    
    const surpriseWords = ['wow', 'surprising', 'unexpected', 'amazed', 'astonished', 'shocked'];
    
    const fearWords = ['afraid', 'scared', 'fear', 'terrified', 'worry', 'anxious'];
    
    const disgustWords = ['disgusting', 'gross', 'yuck', 'nasty', 'revolting'];
    
   
    const sensitivityFactor = getSensitivityFactor();
    
    
    const lowercaseText = text.toLowerCase();
    
  
    happyWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.happy += sensitivityFactor;
      }
    });
    
    sadWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.sad += sensitivityFactor;
      }
    });
    
    angryWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.angry += sensitivityFactor;
      }
    });
    
    surpriseWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.surprise += sensitivityFactor;
      }
    });
    
    fearWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.fear += sensitivityFactor;
      }
    });
    
    disgustWords.forEach(word => {
      if (lowercaseText.includes(word)) {
        emotions.disgust += sensitivityFactor;
      }
    });
    
    
    const totalEmotion = Object.values(emotions).reduce((a, b) => a + b, 0);
    if (totalEmotion > 0) {
      Object.keys(emotions).forEach(key => {
        emotions[key] = emotions[key] / totalEmotion;
      });
    }
    
    return emotions;
  }
  
 
  function updateEmotionalData(emotions) {
    Object.keys(emotions).forEach(key => {
      if (emotionalData[key] !== undefined) {
       
        emotionalData[key] = (emotionalData[key] * 0.8) + (emotions[key] * 0.2);
      }
    });
    
   
    normalizeEmotionalData();
  }
  
 
  function normalizeEmotionalData() {
    const total = Object.values(emotionalData).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(emotionalData).forEach(key => {
        emotionalData[key] = emotionalData[key] / total;
      });
    }
  }
  
  
  function shouldHighlight(emotions) {
    const threshold = getThreshold();
    return Object.values(emotions).some(value => value > threshold);
  }
  

  function highlightElement(element, emotions) {
   
    const originalStyles = {
      backgroundColor: element.style.backgroundColor,
      border: element.style.border,
      padding: element.style.padding
    };
    
   
    const dominantEmotion = getDominantEmotion(emotions);
    const color = getEmotionColor(dominantEmotion);
    
   
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
   
    highlightedElements.push({
      element: element,
      wrapper: wrapper,
      originalStyles: originalStyles
    });
    
   
    if (settings.displayMode === 'highlight') {
      element.style.backgroundColor = `${color}33`; // 20% opacity
      element.style.border = `1px solid ${color}`;
      element.style.padding = '2px';
      
    
      element.title = generateEmotionTooltip(emotions);
    }
  }
  
 
  function updateDisplay() {
  
    clearDisplayElements();
    
    if (!settings.enabled) return;
    
 
    switch (settings.displayMode) {
      case 'highlight':
       
        break;
        
      case 'overlay':
        createOverlay();
        break;
        
      case 'sidebar':
        createSidebar();
        break;
    }
  }
  
 
  function clearDisplayElements() {
   
    highlightedElements.forEach(item => {
      Object.assign(item.element.style, item.originalStyles);
      item.element.title = '';
      
      if (item.wrapper.parentNode) {
        item.wrapper.parentNode.replaceChild(item.element, item.wrapper);
      }
    });
    highlightedElements = [];
    
   
    if (overlayElement && overlayElement.parentNode) {
      overlayElement.parentNode.removeChild(overlayElement);
    }
    overlayElement = null;
    
   
    if (sidebarElement && sidebarElement.parentNode) {
      sidebarElement.parentNode.removeChild(sidebarElement);
    }
    sidebarElement = null;
  }
  
  
  function createOverlay() {
    overlayElement = document.createElement('div');
    overlayElement.className = 'emotion-lens-overlay';
    overlayElement.style.position = 'fixed';
    overlayElement.style.bottom = '10px';
    overlayElement.style.right = '10px';
    overlayElement.style.width = '220px';
    overlayElement.style.padding = '10px';
    overlayElement.style.backgroundColor = 'white';
    overlayElement.style.border = '1px solid #ccc';
    overlayElement.style.borderRadius = '5px';
    overlayElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    overlayElement.style.zIndex = '9999';
    overlayElement.style.fontFamily = 'Arial, sans-serif';
    
   
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '10px';
    
    const logo = document.createElement('img');
   
    logo.src = chrome.runtime.getURL('images/icon16.png');
    logo.style.width = '16px';
    logo.style.height = '16px';
    logo.style.marginRight = '5px';
    
    const title = document.createElement('h3');
    title.textContent = 'EmotionLens';
    title.style.margin = '0';
    title.style.fontSize = '14px';
    
    header.appendChild(logo);
    header.appendChild(title);
    
   
    const content = document.createElement('div');
    
   
    for (const [emotion, value] of Object.entries(emotionalData)) {
      const emotionBar = createEmotionBar(emotion, value);
      content.appendChild(emotionBar);
    }
    
   
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
      overlayElement = null;
    };
    
    overlayElement.appendChild(closeButton);
    overlayElement.appendChild(header);
    overlayElement.appendChild(content);
    
  
    document.body.appendChild(overlayElement);
  }
  
 
  function createSidebar() {
    sidebarElement = document.createElement('div');
    sidebarElement.className = 'emotion-lens-sidebar';
    sidebarElement.style.position = 'fixed';
    sidebarElement.style.top = '0';
    sidebarElement.style.right = '0';
    sidebarElement.style.width = '250px';
    sidebarElement.style.height = '100%';
    sidebarElement.style.backgroundColor = 'white';
    sidebarElement.style.borderLeft = '1px solid #ccc';
    sidebarElement.style.boxShadow = '-2px 0 10px rgba(0,0,0,0.1)';
    sidebarElement.style.zIndex = '9999';
    sidebarElement.style.padding = '20px';
    sidebarElement.style.boxSizing = 'border-box';
    sidebarElement.style.fontFamily = 'Arial, sans-serif';
    sidebarElement.style.overflowY = 'auto';
    
   
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';
    
    const logo = document.createElement('img');
    logo.src = chrome.runtime.getURL('images/icon48.png');
    logo.style.width = '24px';
    logo.style.height = '24px';
    logo.style.marginRight = '10px';
    
    const title = document.createElement('h2');
    title.textContent = 'EmotionLens';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    
    header.appendChild(logo);
    header.appendChild(title);
    
   
    const summary = document.createElement('div');
    summary.style.marginBottom = '20px';
    
    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = 'Page Emotional Summary';
    summaryTitle.style.fontSize = '16px';
    summaryTitle.style.margin = '0 0 10px 0';
    
   
    const dominantEmotion = getDominantEmotion(emotionalData);
    
    const summaryText = document.createElement('p');
    summaryText.textContent = `This page has a predominantly ${dominantEmotion} tone.`;
    summaryText.style.margin = '0 0 10px 0';
    
    summary.appendChild(summaryTitle);
    summary.appendChild(summaryText);
    
   
    const breakdown = document.createElement('div');
    breakdown.style.marginBottom = '20px';
    
    const breakdownTitle = document.createElement('h3');
    breakdownTitle.textContent = 'Emotional Breakdown';
    breakdownTitle.style.fontSize = '16px';
    breakdownTitle.style.margin = '0 0 10px 0';
    
    breakdown.appendChild(breakdownTitle);
    
    
    for (const [emotion, value] of Object.entries(emotionalData)) {
      const emotionBar = createEmotionBar(emotion, value);
      breakdown.appendChild(emotionBar);
    }
    
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
      if (sidebarElement.parentNode) {
        sidebarElement.parentNode.removeChild(sidebarElement);
      }
      sidebarElement = null;
    };
    
   
    sidebarElement.appendChild(closeButton);
    sidebarElement.appendChild(header);
    sidebarElement.appendChild(summary);
    sidebarElement.appendChild(breakdown);
    
    
    document.body.appendChild(sidebarElement);
  }
  

  function createEmotionBar(emotion, value) {
    const percentage = Math.round(value * 100);
    
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.marginBottom = '5px';
    
    const label = document.createElement('span');
    label.textContent = getEmotionIcon(emotion) + ' ' + capitalizeFirstLetter(emotion);
    label.style.width = '80px';
    label.style.marginRight = '10px';
    
    const barContainer = document.createElement('div');
    barContainer.style.flex = '1';
    barContainer.style.height = '10px';
    barContainer.style.backgroundColor = '#f0f0f0';
    barContainer.style.borderRadius = '5px';
    barContainer.style.overflow = 'hidden';
    
    const bar = document.createElement('div');
    bar.style.width = `${percentage}%`;
    bar.style.height = '100%';
    bar.style.backgroundColor = getEmotionColor(emotion);
    
    const percentLabel = document.createElement('span');
    percentLabel.textContent = `${percentage}%`;
    percentLabel.style.marginLeft = '5px';
    percentLabel.style.fontSize = '12px';
    percentLabel.style.width = '35px';
    percentLabel.style.textAlign = 'right';
    
    barContainer.appendChild(bar);
    container.appendChild(label);
    container.appendChild(barContainer);
    container.appendChild(percentLabel);
    
    return