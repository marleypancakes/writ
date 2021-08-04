const current_url = window.location.toString();
const headline = document.querySelector('h1')

// If it's a CNN article, get the article body from their specific body paragraph class
if (current_url.match(/www\.cnn\.com/)){
    const article_body = document.querySelectorAll('p.zn-body__paragraph, div.zn-body__paragraph')
    for (elm of article_body) {
        console.log(elm.innerText)
    }
} else {
    // The majority of news articles just keep their body text in p tags, however.
    let article_body = document.querySelectorAll('p')
    for (elm of article_body){
        console.log(elm.innerText)
    }

}


