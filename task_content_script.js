// Put all the javascript code here, that you want to execute after page load.
const ENDPOINT_GITHUB = 'https://api.github.com'
const ENDPOINT_CLICKUP = "https://api.clickup.com/api/v2"

const _browser = (typeof browser === 'undefined') ? chrome : browser
const storage = _browser.storage

var hasGithubIconDetected = false
let lastUrl = location.href; 
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        onUrlChange();
    }

    if (!hasGithubIconDetected) {
        const taskContainer = document.getElementsByClassName('task-container')[0]
        if (document.contains(taskContainer)) {
            const githubIcon = _getGithubIcon()
            if (githubIcon != undefined) { 
                _prependCreateIssueButton(githubIcon.parentElement)
                hasGithubIconDetected = true
            }
        }
    }
    
}).observe(document, {subtree: true, childList: true});

/**
 * 
 * @returns {Node}
 */
function _getGithubIcon() {
    const elem = $('cu-git-info-icon').get()[0]
    return elem
}

/**
 * 
 * @param {Node} container 
 */
function _prependCreateIssueButton(container) {
    // To mimic clickup's style
    const createNewIssueBtn = $('<div class="cu-task-header__control cu-task-header__control_public-sharing"><div class="cu-task-header__control_public-sharing-text cu-task-header__control_public-sharing-text-copy">Create new issue</div></div>')
    const title = $('.task-name__overlay')[0]
    $(container).prepend(createNewIssueBtn)
    console.log(title.innerHTML)
    // $(createNewIssueBtn).click(onCreateIssueClicked.apply(this, [location.href, taskName.html()]))
    $(createNewIssueBtn).click({ 
        url: location.href, 
        title: title.innerHTML
    }, onCreateIssueClicked)
}

function onUrlChange() {
    _resetFlags()
}

function _resetFlags() {
    hasGithubIconDetected = false
}

/**
 * @typedef {Object} TaskData
 * @property {string} url
 * @property {string} title
 */
/**
 * @param {Object} jQuery event object
 */
const onCreateIssueClicked = async (e) => {
    console.log('@@@ onCreateIssueClicked')
    
    const loadingIndicator = $('<div class="cu-ext-loading-indicator"></div>')
    $(e.target.parentElement).append(loadingIndicator)
    
    /**
     * @type {TaskData}
     */
    const data = e.data
    const taskId = data.url.substring(data.url.lastIndexOf('/t/') + 3)
    const title = data.title

    const issueLink = await _createGithubIssue(taskId, data.url, title)
    if (issueLink != null) {
        const response = await _addClickupComment(taskId, 'Github task created: ' + issueLink)
        $(loadingIndicator).remove()
    } else {
        alert('Github issue creation failed')
    }
}


// API tasks
/**
 * 
 * @param {string} clickupTaskId 
 * @param {string} clickupTaskUrl
 * @param {string} clickUpTaskTitle 
 * 
 * @returns {Promise<string>}
 */
 async function _createGithubIssue(clickupTaskId, clickupTaskUrl, clickUpTaskTitle) {
    const res = await getFromStorage(['api_keys', 'github_options'])
    console.log(res)

    const githubApiKey = res.api_keys.github_api_key
    const repo = res.github_options.github_option_default_repo
    const username = res.github_options.github_option_username
    // console.log('### ' + repo + ' auth=' + username + ':' + githubApiKey)
    
    try {
        const endpoint = ENDPOINT_GITHUB + '/repos/' + repo + '/issues'
        // console.log('@@@ ' + endpoint)
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + githubApiKey)
            },
            body: JSON.stringify({
                'title': '#' + clickupTaskId + ' - ' + clickUpTaskTitle,
                'body': 'Related: ' + clickupTaskUrl
            })
        })
        const json = await response.json()
        console.log(json)
        return json.html_url
    } catch (e) {
        console.error(e)
        // Parse task ID
        // Show loading indicator
        // Create github task Title = "#clickUpTaskId - clickUpTaskTitle, body=url"
        // Ping to comment for github link - Github task created: {link}
        return null
    }
}

/**
 * 
 * @param {string} taskId 
 * @param {string} comment 
 */
async function _addClickupComment(taskId, comment) {
    const res = await getFromStorage('api_keys')
    const clickupApiKey = res.api_keys.clickup_api_key    

    try {
        const endpoint = ENDPOINT_CLICKUP + '/task/' + taskId + '/comment'
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Authorization": clickupApiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "comment_text": comment
            })
        })
        return await response.json()
    } catch (e) {
        console.error(e)
        return null
    }
}

const getFromStorage = keys => new Promise((resolve, reject) => {
    return storage.sync.get(keys, result => resolve(result))
})