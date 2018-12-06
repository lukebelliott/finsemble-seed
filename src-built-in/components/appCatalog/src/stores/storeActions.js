/*!
* Copyright 2018 by ChartIQ, Inc.
* All rights reserved.
*/
import AppDirectory from '../modules/AppDirectory'
import FDC3 from '../modules/FDC3'
import { getStore } from './appStore';

export default {
    initialize,
    getApps,
    getFilteredApps,
    clearFilteredApps,
    searchApps,
    getActiveTags,
    getTags,
    addTag,
    removeTag,
    clearTags,
    addApp,
    removeApp,
    openApp,
    clearApp,
    getInstalledApps,
    getActiveApp
}

const data = {};

/**
 * I'm thinking of using  a local distributed store and the FDC3 client
 * Some data will be pulled from appd and some from the local store
 * Not sure if the localstore needs to be a persistent one at some point?
 */
const FDC3Client = new FDC3({url: 'http://localhost:3030/v1'})
const appd = new AppDirectory(FDC3Client);

function initialize(done = Function.prototype) {
    const store = getStore();
    data.apps = store.values.apps;
    data.tags = store.values.tags;
    data.filteredApps = store.values.filteredApps;
    data.activeTags = store.values.activeTags;
    data.activeApp = store.values.activeApp;

    store.addListener({ field: 'apps' }, (err, dt) => data.apps = dt.value);
    store.addListener({ field: 'tags' }, (err, dt) => data.tags = dt.value);
    store.addListener({ field: 'activeApp' }, (err, dt) => data.activeApp = dt.value);
    store.addListener({ field: 'activeTags' }, (err, dt) => data.activeTags = dt.value);
    store.addListener({ field: 'filteredApps' }, (err, dt) => data.filteredApps = dt.value);
    done();
}

/**
 * Private function to add an active tag. This will filter apps based on tags
 * NOTE: This will need to use search
 * @param {string} tag The name of the tag
 */
function _addActiveTag(tag) {

    let { apps, activeTags } = data;

    activeTags.push(tag);

    let newApps = apps.filter((app) => {
        for (let i = 0; i < activeTags.length; i++) {
            let tag = activeTags[i].trim();
            if (app.tags.includes(tag)) {
                return true;
            }
        }
    });

    getStore().setValues([
        {
            field: 'filteredApps',
            value: newApps
        },
        {
            field: 'activeTags',
            value: activeTags
        }
    ]);
}

/**
 * Private function to remove an active tag. This will filter apps based on tags
 * NOTE: This will need to use search
 * @param {string} tag The name of the tag
 */
function _removeActiveTag(tag) {

    let { activeTags, apps } = data;

    let newActiveTags = activeTags.filter((currentTag) => {
        return currentTag !== tag;
    });

    let newApps = apps.filter((app) => {
        for (let i = 0; i < newActiveTags.length; i++) {
            let tag = activeTags[i].trim();
            if (app.tags.includes(tag)) {
                return true;
            }
        }
    });

    getStore().setValues([{
        field: 'activeTags',
        value: newActiveTags
    }, {
        field: 'filteredApps',
        value: newApps
    }]);
}

/**
 * Clears all active tags
 */
function _clearActiveTags() {
    getStore().setValue({
        field: 'activeTags',
        value: []
    });
}

/**
 * Async function to fetch apps from the FDC3 api (appD)
 */
async function getApps() {
    let apps = await appd.getAll((err, apps) => {
        getStore().setValue({
            field: 'apps',
            value: apps
        });
    });
    return apps;
}

/**
 * Call to appD to get the list of all tags
 */
async function getTags() {
    let tags = await appd.getTags((err, tags) => {
        getStore().setValue({
            field: 'tags',
            value: tags
        });
    });
    return tags;
}

/**
 * Function to "install" an app. Adds the id to a list of installed apps
 * @param {string} name The name of the app
 */
function addApp(id) {
    let { installed, apps, activeApp } = getStore().getValues([
        {
            field: 'apps'
        },
        {
            field: 'installed'
        },
        {
            field: 'activeApp'
        }
    ])

    for (let i = 0; i < apps.length; i++) {
        let app = apps[i];
        let thisAppId = app.appId;
        if (thisAppId === id && !installed.includes(id)) {
            installed.push(id);
            break;
        }

        if (activeApp.appId === id) {
            activeApp.installed = true;
        }
    };

    console.log('installed on add: ', installed);

    getStore().setValues([
        {
            field: 'installed',
            value: installed
        },
        {
            field: 'activeApp',
            value: activeApp
        }
    ])
}

/**
 * Function to "uninstall" an app. Removes the id from a list of installed apps
 * @param {string} name The name of the app
 */
function removeApp(id) {
    let { apps, installed, activeApp } = getStore().getValues(["apps", "installed", "activeApp"]);

    for (let i = 0; i < apps.length; i++) {
        let app = apps[i];
        let thisAppId = app.appId;
        if (thisAppId === id && installed.includes(id)) {
            let index = installed.indexOf(id);
            installed.splice(index, 1);
            break;
        }

        if (activeApp.appId === id) {
            activeApp.installed = false;
        }
    }

    console.log('installed on remove: ', installed);

    getStore().setValues([
        {
            field: 'installed',
            value: installed
        },
        {
            field: 'activeApp',
            value: activeApp
        }
    ])
}

/**
 * Function to set the 'active app' for the catalog.
 * @param {string} id The app id to show as the actively showcasing app
 */
function openApp(id) {
    let apps = data.apps;
    console.log('apps: ', apps);

    let index = apps.findIndex((app) => {
        return app.appId === id;
    });
    console.log('index: ', index);

    let app = null;
    if (index >= 0 && index < apps.length) {
        app = apps[index];
    }
    console.log('app: ', app);

    getStore().setValue({
        field: 'activeApp',
        value: app
    });
}

function clearApp() {
    getStore().setValue({
        field: 'activeApp',
        value: null
    });
}

function getActiveApp() {
    return data.activeApp;
}

/**
 * Gets the list of installed apps
 */
function getInstalledApps() {
    // return getStore().getValue({
    //     field: 'installed'
    // }, err => {
    //     if (err) console.warn("Error getting installed apps");
    // });
}

/**
 * Gets the list of filtered apps (when searching/filtering by tags)
 */
function getFilteredApps() {
    return data.filteredApps;
}

/**
 * Clears the list of filtered apps
 */
function clearFilteredApps() {
    getStore().setValue({
        field: 'filteredApps',
        value: []
    });
}

/**
 * Gets the list of active tags (these are tags that are actively filtering the content list)
 */
function getActiveTags() {
    return data.activeTags;
}

/**
 * Adds an 'active tag' to the list of filtered tags
 * @param {string} tag The tag name
 */
function addTag(tag) {
    _addActiveTag(tag);
}

/**
 * Removes an 'active tag' from the list of filtered tags
 * @param {string} tag The tag name
 */
function removeTag(tag) {
    _removeActiveTag(tag);
}

/**
 * Removes all tags from the active tags list
 */
function clearTags() {
    _clearActiveTags();
}

/**
 * Calls appD to search the directory of apps based on search text and tag names
 * @param {string} terms The search terms provided by the user
 */
function searchApps(terms) {
    let activeTags = getStore().getValue({
        field: 'activeTags'
    }, err => {
        if (err) console.warn("Error getting active tags");
    });

    //TODO: The appd search endpoint returns all apps always
    appd.search({ text: terms, tags: activeTags }, (err, data) => {
        if (err) console.log("Failed to search apps");
        getStore().setValue({
            field: 'filteredApps',
            value: data
        });
    });
}

/**
 * Retrieves a list of installed apps by id
 */
// function getInstalledApps() {
//     return getStore().getValue({
//         field: 'installed'
//     });
// }

// /**
//  * Async function to call the launcher client to get a list of added apps
//  */
// function fetchInstalledApps() {
//     //NOTE: This is a WIP. This api may change so its commented out for now
//     // FSBL.Clients.LauncherClient.getComponentList((err, apps) => {
//     //     if (err) console.log("Error fetching list of added apps");
//     //     getStore().setValue({
//     //         field: 'installed',
//     //         value: apps
//     //     });
//     //     return apps;
//     // });
//     let apps = getStore().getValue({
//         field: 'apps'
//     });

//     let installed = [];
//     if (apps.length > 0) installed.push([apps[0].appId]);

//     getStore().setValue({
//         field: 'installed',
//         value: installed
//     });
// }