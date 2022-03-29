# About

This is a ClickUp extension designed for Chrome and Firefox

## Features

1. A handy "Create new issue" button in ClickUp task, when clicked a new issue in Github will be created with format: `#{clickup_task_id} - {ClickUp issue name}`. After task creation, a new comment with Github link will be added. ![feature_1](assets/addon_feature_1.png)

2. Allowing batch select backlinked tasks and add comments in batch. (TBD)

## Installation guide

Clone this repository to your directory

### Firefox

1. Go to `about:config`, click "Accept the Risk and Continue"
2. Search for `xpinstall.signatures.required` and set to `false`![img](assets/firefox_addon_install_1.png)
3. Install `web-ext` command ([Guide](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/))

    ```shell
    npm install --global web-ext
    ```

4. Go to this repository and execute `web-ext build`, a zip artifact should be created under `web-ext-artifacts/`
5. Go to `about:addons` in Firefox, drag this zip file to install, you may see some warning, acknowledge it.

### Chrome

1. Go to `chrome://extensions`
2. Turn on "Developer mode" ![img](assets/chrome_addon_install_1.png)
3. Click "Load unpacked" from the menu
4. Select this repository

## Setup

Addon setup steps

### Firefox

1. Go to `about:addons`
2. Select "Preferences" ![img](assets/firefox_addon_setup_1.png)

### Chrome

1. Go to `chrome://extensions`
2. Click on "Details"
3. Scroll down to find "Extension options" ![img](assets/chrome_addon_setup_1.png)

Then, you will need to setup the followings in the preference page.

1. ClickUp API key
2. Github API key -> follow these steps. Obtaining only `repo` permission should be enough for now ![github_1](assets/github_token_1.png)![github_2](assets/github_token_2.png)![github_3](assets/github_token_3.png)![github_4](assets/github_token_4.png)
3. Github username
4. Your default working repository
5. Click save -> Done!


