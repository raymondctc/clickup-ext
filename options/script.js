// https://github.com/mdn/webextensions-examples/blob/master/favourite-colour/options.js

function saveOptions(e) {
    const formData = new FormData(document.querySelector('form'))

    const data = {}
    for (var pair of formData.entries()) {
        data[pair[0]] = pair[1]
    }

    browser.storage.sync.set({
        'api_keys': data
    })

    e.preventDefault();
}

function restoreOptions() {
    let storageItem = browser.storage.sync.get('api_keys')
    storageItem.then((res) => {
        document.getElementById('clickup_api_key').value = res.api_keys.clickup_api_key
        document.getElementById('github_api_key').value = res.api_keys.github_api_key
    });
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

