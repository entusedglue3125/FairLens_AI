chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-fairlens",
    title: "Analyze with FairLens AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-fairlens") {
    // Open the side panel for this specific window
    chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Store the text so the side panel can read it when it loads
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Also broadcast it in case the panel is already open
      chrome.runtime.sendMessage({
        type: 'FAIRLENS_ANALYZE_TEXT',
        text: info.selectionText
      }).catch(() => {
        // Panel might not be open yet, it will read from storage when it mounts
      });
    });
  }
});

// Allow the user to open the side panel by clicking the extension icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
