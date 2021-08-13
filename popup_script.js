const archiveLink = document.getElementById('archive-link')
console.log('hello');

chrome.storage.sync.get('active', data => {
    console.log(data)
    if (data.active === true) {
        document.getElementById('main-switch').checked = true;
        document.getElementById('title-box').style.backgroundColor = '#E6FFE6';
        document.querySelector('.mark').style.visibility = 'hidden';
        chrome.storage.sync.get('archiveUrl', url => {
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



chrome.storage.sync.get('autoLoad', data => {
    if(data.autoLoad === false){
        loadButton = document.createElement("div");
        loadButton.className = 'popup-link';
        loadButtonContents = document.createTextNode("✒️ load changes")
        loadLink = document.createElement("a");
        loadLink.appendChild(loadButtonContents);
        loadButton.appendChild(loadLink);
        document.body.appendChild(loadButton)

        const loadChanges = async function() {
            console.log('clicked!')
            chrome.runtime.sendMessage({
                message: 'load changes'
            }, response => {
                if(response.message === 'changes loaded'){
                    loadButtonContents.nodeValue = "✔️ changes loaded"
                }
                return true;
            })
        }
        
        loadButton.onclick = loadChanges
    }
})

const autoLoad = document.getElementById("auto-load-button")

chrome.storage.sync.get('autoLoad', data => {
    if (data.autoLoad === true) {
        autoLoad.checked = true;
    } else {
        autoLoad.checked = false;
    }
})

autoLoad.addEventListener('change', (e) => {
    if (e.target.checked) {
        chrome.storage.sync.set({
            autoLoad: true
        })
        console.log("autoload on")
    } else {
        chrome.storage.sync.set({
            autoLoad: false
        })
        console.log("autoload off")

    }
})

document.getElementById('main-switch').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('title-box').style.backgroundColor = '#E6FFE6';
        document.querySelector('.mark').style.visibility = 'hidden';
        chrome.storage.sync.set({
            active: true
        })

    } else {
        console.log(e.target.checked)
        document.getElementById('title-box').style.backgroundColor = '#FFE6E6';
        document.querySelector('.mark').style.visibility = 'visible';
        chrome.storage.sync.set({
            active: false
        })
        chrome.runtime.sendMessage({
            message: 'reload'
        })
    }

})

