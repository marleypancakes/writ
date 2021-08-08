let paywall = document.body.innerHTML.indexOf('paywall') !== -1
let headline = document.querySelector('h1').innerText;
const page_data = {
    url: window.location.toString(),
    headline: headline,
    body: [],
    paywall: paywall
};

const archive_data = {
    url: '',
    headline: '',
    body: []
}

// If it's a CNN article, get the article body from their specific body paragraph class
if (window.location.toString().match(/www\.cnn\.com/)) {
    const article_body = document.querySelectorAll('p.zn-body__paragraph, div.zn-body__paragraph')
    for (elm of article_body) {
        page_data.body.push(elm.innerText);
    }
} else {
    // The majority of news articles just keep their body text in p tags, however.
    let article_body = document.querySelectorAll('p');
    for (elm of article_body) {
        page_data.body.push(elm.innerText);
    }
};
console.log(page_data);

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//         if (request.message === 'get_page_data'){
//             sendResponse({
//                 message: 'success',
//                 payload: page_data
//             });
//         };
//         return true;
//     }

// )
chrome.storage.local.get('active', data => {
    console.log(data);
    if (data.active) {
        chrome.runtime.sendMessage({
            message: 'get_page_data',
            payload: page_data
        }, response => {
            console.log(response.message);
            if (response.message === 'success') {
                chrome.storage.local.set({
                    loaded: true,
                    archiveUrl: response.archiveUrl
                })
                console.log(response.payload);
                document.querySelector('h1').innerHTML = response.payload.headline;

                if (window.location.toString().match(/www\.cnn\.com/)) {
                    paragraphs = document.querySelectorAll('.zn-body__paragraph');
                    for (i = 0; i < paragraphs.length; i++) {
                        paragraphs[i].innerHTML = response.payload.body[i];
                    }
                } else {
                    paragraphs = document.querySelectorAll('p');
                    for (i = 0; i < paragraphs.length; i++) {
                        paragraphs[i].innerHTML = response.payload.body[i];
                    }
                }
                chrome.runtime.sendMessage({
                    message: 'send_archive_url',
                    payload: res.body.archive_url
                })

            } else if (response.message === 'failure') {
                chrome.storage.local.set({
                    archiveUrl: null
                })
            }
        })
    }
})




chrome.runtime.onMessage.addListener((request) => {
    if (request.message === 'reload') {
        console.log(request.message);
        window.location.reload;
    }
})


