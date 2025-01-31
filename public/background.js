// Background script for BitsCrunch NFT Analytics Extension

// Function to extract NFT details from OpenSea URL
function extractNFTDetails(url) {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('opensea.io')) return null;
    
    // OpenSea URL format: https://opensea.io/assets/[blockchain]/[contract_address]/[token_id]
    const parts = urlObj.pathname.split('/');
    if (parts.includes('assets') && parts.length >= 5) {
      return {
        blockchain: parts[parts.indexOf('assets') + 1],
        contractAddress: parts[parts.indexOf('assets') + 2],
        tokenId: parts[parts.indexOf('assets') + 3]
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing OpenSea URL:', error);
    return null;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_API_KEY') {
    // Retrieve API key from storage
    chrome.storage.local.get(['nft_analytics_api_key'], (result) => {
      sendResponse({ apiKey: result.nft_analytics_api_key || '' });
    });
    return true; // Required for async response
  }

  if (request.type === 'SET_API_KEY') {
    // Store API key
    chrome.storage.local.set({ nft_analytics_api_key: request.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'GET_NFT_DETAILS') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];
      const nftDetails = extractNFTDetails(currentTab.url);
      sendResponse({ nftDetails });
    });
    return true;
  }
});

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('BitsCrunch NFT Analytics Extension installed');
});