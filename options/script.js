// https://github.com/mdn/webextensions-examples/blob/master/favourite-colour/options.js

const _browser = (typeof browser === 'undefined') ? chrome : browser
const storage = _browser.storage

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

    storage.sync.set({
        'api_keys': apiKeys,
        'github_options': githubOptions
    })

    e.preventDefault();
}

function restoreOptions() {
    storage.sync.get('api_keys', (res) => {
        const clickUpApiKey = res.api_keys.clickup_api_key
        const githubApiKey = res.api_keys.github_api_key
        if (clickUpApiKey) {
            document.getElementById('clickup_api_key').value = clickUpApiKey
        }
        
        if (githubApiKey) {
            document.getElementById('github_api_key').value = githubApiKey
        }
    })

    storage.sync.get('github_options', (res) => {
        const githubUsername = res.github_options.github_option_username
        const githubRepo = res.github_options.github_option_default_repo

        if (githubUsername) {
            document.getElementById('github_option_username').value = githubUsername
        }
        
        if (githubRepo) {
            document.getElementById('github_option_default_repo').value = githubRepo
        }
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

