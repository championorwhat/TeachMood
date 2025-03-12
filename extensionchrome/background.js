
let pageEmotions = {};

chrome.runtime.onInstalled.addListener(function() {
  console.log('EmotionLens extension installed');
  
 chrome.storage.sync.set({
    enabled: true,
    displayMode: 'highlight',
    sensitivity: 'medium'
  }, function() {
    console.log('Default settings initialized');
  });
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if (message.action === 'analysisComplete' && sender.tab) {
    const url = message.url;
    pageEmotions[url] = message.emotions;
    
   
    updateBadge(sender.tab.id, message.emotions);
    
    sendResponse({success: true});
  }
  
 
  else if (message.action === 'getPageEmotions' && message.url) {
    sendResponse({
      emotions: pageEmotions[message.url] || null
    });
  }
  
  return true;
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = tab.url;
    
   
    if (pageEmotions[url]) {
      updateBadge(tabId, pageEmotions[url]);
    } else {
     
      chrome.action.setBadgeText({
        tabId: tabId,
        text: ''
      });
    }
  }
});


function updateBadge(tabId, emotions) {
  if (!emotions) return;
  
  
  const dominantEmotion = getDominantEmotion(emotions);
  
 
  chrome.action.setBadgeText({
    tabId: tabId,
    text: dominantEmotion.charAt(0).toUpperCase()
  });
  

  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: getEmotionBadgeColor(dominantEmotion)
  });
}


function getDominantEmotion(emotions) {
  let maxEmotion = '';
  let maxValue = 0;
  
  for (const [emotion, value] of Object.entries(emotions)) {
    if (value > maxValue) {
      maxValue = value;
      maxEmotion = emotion;
    }
  }
  
  return maxEmotion;
}


function getEmotionBadgeColor(emotion) {
  switch (emotion) {
    case 'happy':
      return '#4CAF50'; 
    case 'sad':
      return '#2196F3'; 
    case 'angry':
      return '#F44336'; 
    case 'surprise':
      return '#FF9800'; 
    case 'fear':
      return '#9C27B0'; 
    case 'disgust':
      return '#795548'; 
    default:
      return '#9E9E9E'; 
  }
}