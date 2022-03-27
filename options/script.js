// https://github.com/mdn/webextensions-examples/blob/master/favourite-colour/options.js

function saveOptions(e) {
    const formData = new FormData(document.querySelector('form'))

    const apiKeys = {}
    const githubOptions = {}
    for (var pair of formData.entries()) {
        const key = pair[0]
        const value = pair[1]

        if (key.includes('api_key')) {
            apiKeys[key] = value
        }

        if (key.includes('github_option')) {
            githubOptions[key] = value
        }
        
    }

    browser.storage.sync.set({
        'api_keys': apiKeys,
        'github_options': githubOptions
    })

    e.preventDefault();
}

function restoreOptions() {
    let storageItem = browser.storage.sync.get('api_keys')
    storageItem.then((res) => {
        document.getElementById('clickup_api_key').value = res.api_keys.clickup_api_key
        document.getElementById('github_api_key').value = res.api_keys.github_api_key
        document.getElementById('github_option_default_repo').value = res.github_options.github_option_default_repo
    });
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

