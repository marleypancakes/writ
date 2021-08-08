const archiveLink = document.getElementById('archive-link')
console.log('hello');

chrome.storage.local.get('active', data => {
    console.log(data)
    if (data.active === true) {
        document.getElementById('main-switch').checked = true;
        document.getElementById('title-box').style.backgroundColor = '#E6FFE6';
        document.querySelector('.mark').style.visibility = 'hidden';
        chrome.storage.local.get('archiveUrl', url => {
            if (url.archiveUrl){
                document.getElementById('archive-link').href = url.archiveUrl;
                document.getElementById('archive-link').target = '_blank'
            } else {
                document.getElementById('archive-link').href = 'javascript: void(0)';
                document.getElementById('archive-link').innerText = '❌ no archive found'
                document.getElementById('archive-link').style.cursor = 'default'
            }
        });
    } else {
        document.getElementById('main-switch').checked = false;
        document.getElementById('title-box').style.backgroundColor = '#FFE6E6';
        document.querySelector('.mark').style.visibility = 'visible';
    }
})

document.getElementById('main-switch').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('title-box').style.backgroundColor = '#E6FFE6';
        document.querySelector('.mark').style.visibility = 'hidden';
        chrome.storage.local.set({
            active: true
        })

    } else {
        console.log(e.target.checked)
        document.getElementById('title-box').style.backgroundColor = '#FFE6E6';
        document.querySelector('.mark').style.visibility = 'visible';
        chrome.storage.local.set({
            active: false
        })
        chrome.runtime.sendMessage({
            message: 'reload'
        })
    }

})


chrome.runtime.onMessage.addListener((request) => {
    if (request.message === 'no archive') {
    };
});