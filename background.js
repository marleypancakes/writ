// Add listener for when the user's tabs are updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Once the page is done loading
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        // Inject the CSS
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./static/css/foreground_styles.css"]
        })
            // Async baby so .then this shit
            .then(() => {
                console.log("INJECTED THE FOREGROUND STYLES")
                // Inject the foreground script
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
                    .then(() => {
                        console.log("INJECTED THE FOREGROUND SCRIPT")
                    });
            })
            .catch(err => console.error(err))
    }
});