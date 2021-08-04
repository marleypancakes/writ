const headline = document.querySelector('h1').innerText;

const page_data = {
    url: window.location.toString(),
    headline: headline,
    body: []
};

const archive_data = {
    url: '',
    headline: '',
    body: []
}

// If it's a CNN article, get the article body from their specific body paragraph class
if (window.location.toString().match(/www\.cnn\.com/)){
    const article_body = document.querySelectorAll('p.zn-body__paragraph, div.zn-body__paragraph')
    for (elm of article_body) {
        page_data.body.push(elm.innerText);
    }
} else {
    // The majority of news articles just keep their body text in p tags, however.
    let article_body = document.querySelectorAll('p');
    for (elm of article_body){
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


chrome.runtime.sendMessage({
    message: 'get_page_data',
    payload: page_data
}, response => {
    if(response.message === 'success'){
        console.log(response.payload);
        document.querySelector('h1').innerHTML = response.payload.headline;

        paragraphs = document.querySelectorAll('p');
        for (i=0; i < paragraphs.length; i++) {
            paragraphs[i].innerHTML = response.payload.body[i];
        }
    }
})