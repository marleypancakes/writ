let paywall = document.body.innerHTML.indexOf('paywall') !== -1
let headline

if(document.querySelector('h1')){
    headline = document.querySelector('h1').innerText;
}

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


const loadChanges = (headline, body) => {
    document.querySelector('h1').innerHTML = headline;

    if (window.location.toString().match(/www\.cnn\.com/)) {
        paragraphs = document.querySelectorAll('.zn-body__paragraph');
        for (i = 0; i < paragraphs.length; i++) {
            paragraphs[i].innerHTML = body[i];
        }
    } else {
        paragraphs = document.querySelectorAll('p');
        for (i = 0; i < paragraphs.length; i++) {
            paragraphs[i].innerHTML = body[i];
        }
    }
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

chrome.storage.sync.get('active', data => {
    console.log(data);
    if (data.active) {
        chrome.runtime.sendMessage({
            message: 'get_page_data',
            payload: page_data
        }, response => {
            console.log(response.message);
            if (response.message === 'success') {
                chrome.storage.sync.set({
                    loaded: true,
                    archiveUrl: response.archiveUrl
                })
                console.log(response.payload);

                chrome.storage.sync.get('autoLoad', data => {
                    if (data.autoLoad === true) {

                        loadChanges(response.payload.headline, response.payload.body);

                        chrome.runtime.sendMessage({
                            message: 'send_archive_url',
                            payload: res.body.archive_url
                        })
                    } else {
                        chrome.runtime.sendMessage({
                            message: 'send_archive_url',
                            payload: res.body.archive_url
                        })
                        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
                            if(request.message === 'load changes'){
                                loadChanges(response.payload.headline, response.payload.body);
                                sendResponse({
                                    message: 'changes loaded'
                                })
                            }
                        })
                    }
                })

            } else if (response.message === 'failure') {
                chrome.storage.sync.set({
                    archiveUrl: null
                })
            }
        })
    }
})


