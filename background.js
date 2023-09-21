chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        active: true,
        loaded: false,
        archiveUrl: null,
        autoLoad: true
    });
});


// Add listener for when the user's tabs are updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.set({
        archiveUrl: null
    })
    // Once the page is done loading
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        // Inject the CSS
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./static/css/foreground_styles.css"]
        })
            .then(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./static/JS/jquery-3.6.0.min.js"]
                })
                // Inject the foreground script
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
            })
            .catch(err => console.error(err))
            return true;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_page_data') {
        console.log(request.payload)
        postData("https://writ-server.onrender.com/", request.payload)
        .then((res) => {
            console.log(res)
            if(res.message === 'success'){
                sendResponse({
                    message: 'success',
                    payload: res.body,
                    archiveUrl: res.archiveUrl
                })
            } else if (res.message === 'archive not found') {
                sendResponse({
                    message: 'failure'
                })
            }
        })
        .catch(err => console.error(err))
        return true;
    };
});


// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
