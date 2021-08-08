// const baseUrl = "https://fast-fortress-24491.herokuapp.com/"
const baseUrl = "http://127.0.0.1:5000/"

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        active: true,
        loaded: false,
        archiveUrl: ''
    });
});


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
            // .then(() => {
            //     const data = { site: tab.url };
            //     postData(baseUrl, data)
            //         .then((res) => console.log(res))
            // })
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

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(
//         tabs[0].id,
//         { message: 'get_page_text' },
//         response => {
//             if (response.message === 'success'){
//                 console.log(response.payload);
//                 postData(baseUrl, response.payload)
//             }
//         }
//     );
//     return true;
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_page_data') {
        postData(baseUrl, request.payload)
        .then((res) => {
            console.log(res)
            if(res.message === 'success'){
                sendResponse({
                    message: 'success',
                    payload: res.body,
                    archiveUrl: res.archiveUrl
                });
            } else if (res.message === 'paywall'){
                chrome.runtime.sendMessage({
                    message: 'send_archive_url',
                    payload: res.archive_url
                })
                sendResponse({
                    message: 'paywall',
                    payload: res.body
                })
            } else if (res.message === 'archive not found') {
                sendResponse({
                    message: 'failure',
                    payload: res.body
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