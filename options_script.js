const autoLoad = document.getElementById("auto-load")

chrome.storage.sync.get('autoLoad', data =>{
    if(data.autoLoad === true){
        autoLoad.checked = true;
    } else {
        autoLoad.checked = false;
    }
})

autoLoad.addEventListener('change', () => {
    if(autoLoad.checked){
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