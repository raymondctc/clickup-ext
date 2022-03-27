// Put all the javascript code here, that you want to execute after page load.
// console.log('content_script executed')

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
            const githubIcon = getGithubIcon()
            if (githubIcon != undefined) { 
                prependCreateIssueButton(githubIcon.parentElement)
                hasGithubIconDetected = true
            }
        }
    }
    
}).observe(document, {subtree: true, childList: true});

/**
 * 
 * @returns {Node}
 */
function getGithubIcon() {
    const elem = $('cu-git-info-icon').get()[0]
    return elem
}

/**
 * 
 * @param {Node} container 
 */
function prependCreateIssueButton(container) {
    // To mimic clickup's style
    const createNewIssueBtn = $('<div class="cu-task-header__control cu-task-header__control_public-sharing"><div class="cu-task-header__control_public-sharing-text cu-task-header__control_public-sharing-text-copy">Create new issue</div></div>')
    $(container).prepend(createNewIssueBtn)
}

function onUrlChange() {
    console.log('@@@ URL changed!', location.href);
    resetFlags()
}

function resetFlags() {
    console.log('@@@ resetFlags')
    hasGithubIconDetected = false
}