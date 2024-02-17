var soundq_local;
(function() {
var __webpack_modules__ = {
"638": (function (__unused_webpack_module, exports, __webpack_require__) {
'use strict';
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var share = __webpack_require__(/*! ./share.cjs.js */"566");
var sdk = __webpack_require__(/*! @module-federation/sdk */"70");
// Function to match a remote with its name and expose
// id: pkgName(@federation/app1) + expose(button) = @federation/app1/button
// id: alias(app1) + expose(button) = app1/button
// id: alias(app1/utils) + expose(loadash/sort) = app1/utils/loadash/sort
function matchRemoteWithNameAndExpose(remotes, id) {
    for (const remote of remotes){
        // match pkgName
        const isNameMatched = id.startsWith(remote.name);
        let expose = id.replace(remote.name, '');
        if (isNameMatched) {
            if (expose.startsWith('/')) {
                const pkgNameOrAlias = remote.name;
                expose = `.${expose}`;
                return {
                    pkgNameOrAlias,
                    expose,
                    remote
                };
            } else if (expose === '') return {
                pkgNameOrAlias: remote.name,
                expose: '.',
                remote
            };
        }
        // match alias
        const isAliasMatched = remote.alias && id.startsWith(remote.alias);
        let exposeWithAlias = remote.alias && id.replace(remote.alias, '');
        if (remote.alias && isAliasMatched) {
            if (exposeWithAlias && exposeWithAlias.startsWith('/')) {
                const pkgNameOrAlias = remote.alias;
                exposeWithAlias = `.${exposeWithAlias}`;
                return {
                    pkgNameOrAlias,
                    expose: exposeWithAlias,
                    remote
                };
            } else if (exposeWithAlias === '') return {
                pkgNameOrAlias: remote.alias,
                expose: '.',
                remote
            };
        }
    }
    return;
}
// Function to match a remote with its name or alias
function matchRemote(remotes, nameOrAlias) {
    for (const remote of remotes){
        const isNameMatched = nameOrAlias === remote.name;
        if (isNameMatched) return remote;
        const isAliasMatched = remote.alias && nameOrAlias === remote.alias;
        if (isAliasMatched) return remote;
    }
    return;
}
function registerPlugins(plugins, hookInstances) {
    const globalPlugins = share.getGlobalHostPlugins();
    // Incorporate global plugins
    if (globalPlugins.length > 0) globalPlugins.forEach((plugin)=>{
        if (plugins == null ? void 0 : plugins.find((item)=>item.name !== plugin.name)) plugins.push(plugin);
    });
    if (plugins && plugins.length > 0) plugins.forEach((plugin)=>{
        hookInstances.forEach((hookInstance)=>{
            hookInstance.applyPlugin(plugin);
        });
    });
}
function _extends$5() {
    _extends$5 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$5.apply(this, arguments);
}
async function loadEsmEntry({ entry, remoteEntryExports }) {
    return new Promise((resolve, reject)=>{
        try {
            if (!remoteEntryExports) // eslint-disable-next-line no-eval
            new Function('resolve', `import("${entry}").then((res)=>{resolve(res);}, (error)=> reject(error))`)(resolve);
            else resolve(remoteEntryExports);
        } catch (e) {
            reject(e);
        }
    });
}
async function loadEntryScript({ name: name1, globalName, entry, createScriptHook }) {
    const { entryExports: remoteEntryExports } = share.getRemoteEntryExports(name1, globalName);
    if (remoteEntryExports) return remoteEntryExports;
    if (typeof document === 'undefined') return sdk.loadScriptNode(entry, {
        attrs: {
            name: name1,
            globalName
        },
        createScriptHook
    }).then(()=>{
        const { remoteEntryKey, entryExports } = share.getRemoteEntryExports(name1, globalName);
        share.assert(entryExports, `
        Unable to use the ${name1}'s '${entry}' URL with ${remoteEntryKey}'s globalName to get remoteEntry exports.
        Possible reasons could be:\n
        1. '${entry}' is not the correct URL, or the remoteEntry resource or name is incorrect.\n
        2. ${remoteEntryKey} cannot be used to get remoteEntry exports in the window object.
      `);
        console.log(entryExports);
        return entryExports;
    }).catch((e)=>{
        return e;
    });
    return sdk.loadScript(entry, {
        attrs: {},
        createScriptHook
    }).then(()=>{
        const { remoteEntryKey, entryExports } = share.getRemoteEntryExports(name1, globalName);
        share.assert(entryExports, `
      Unable to use the ${name1}'s '${entry}' URL with ${remoteEntryKey}'s globalName to get remoteEntry exports.
      Possible reasons could be:\n
      1. '${entry}' is not the correct URL, or the remoteEntry resource or name is incorrect.\n
      2. ${remoteEntryKey} cannot be used to get remoteEntry exports in the window object.
    `);
        return entryExports;
    }).catch((e)=>{
        return e;
    });
}
async function getRemoteEntry({ remoteEntryExports, remoteInfo, createScriptHook }) {
    const { entry, name: name1, type, entryGlobalName } = remoteInfo;
    const uniqueKey = sdk.composeKeyWithSeparator(name1, entry);
    if (remoteEntryExports) return remoteEntryExports;
    if (!share.globalLoading[uniqueKey]) {
        if (type === 'esm') share.globalLoading[uniqueKey] = loadEsmEntry({
            entry,
            remoteEntryExports
        });
        else share.globalLoading[uniqueKey] = loadEntryScript({
            name: name1,
            globalName: entryGlobalName,
            entry,
            createScriptHook
        });
    }
    return share.globalLoading[uniqueKey];
}
function getRemoteInfo(remote) {
    return _extends$5({}, remote, {
        entry: 'entry' in remote ? remote.entry : '',
        type: remote.type || share.DEFAULT_REMOTE_TYPE,
        entryGlobalName: remote.entryGlobalName || remote.name,
        shareScope: remote.shareScope || share.DEFAULT_SCOPE
    });
}
function _extends$4() {
    _extends$4 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$4.apply(this, arguments);
}
let Module = class Module {
    async getEntry() {
        if (this.remoteEntryExports) return this.remoteEntryExports;
        // Get remoteEntry.js
        const remoteEntryExports = await getRemoteEntry({
            remoteInfo: this.remoteInfo,
            remoteEntryExports: this.remoteEntryExports,
            createScriptHook: (url)=>{
                const res = this.host.loaderHook.lifecycle.createScript.emit({
                    url
                });
                if (typeof document === 'undefined') //todo: needs real fix
                return res;
                if (res instanceof HTMLScriptElement) return res;
                return;
            }
        });
        share.assert(remoteEntryExports, `remoteEntryExports is undefined \n ${share.safeToString(this.remoteInfo)}`);
        this.remoteEntryExports = remoteEntryExports;
        return this.remoteEntryExports;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async get(expose, options) {
        const { loadFactory = true } = options || {
            loadFactory: true
        };
        // Get remoteEntry.js
        const remoteEntryExports = await this.getEntry();
        if (!this.inited) {
            const localShareScopeMap = this.host.shareScopeMap;
            const remoteShareScope = this.remoteInfo.shareScope || 'default';
            if (!localShareScopeMap[remoteShareScope]) localShareScopeMap[remoteShareScope] = {};
            const shareScope = localShareScopeMap[remoteShareScope];
            const initScope = [];
            const remoteEntryInitOptions = {
                version: this.remoteInfo.version || ''
            };
            // Help to find host instance
            Object.defineProperty(remoteEntryInitOptions, 'hostId', {
                value: this.host.options.id || this.host.name,
                // remoteEntryInitOptions will be traversed and assigned during container init, ,so this attribute is not allowed to be traversed
                enumerable: false
            });
            const initContainerOptions = await this.host.hooks.lifecycle.beforeInitContainer.emit({
                shareScope,
                // @ts-ignore hostId will be set by Object.defineProperty
                remoteEntryInitOptions,
                initScope,
                remoteInfo: this.remoteInfo,
                origin: this.host
            });
            remoteEntryExports.init(initContainerOptions.shareScope, initContainerOptions.initScope, initContainerOptions.remoteEntryInitOptions);
            await this.host.hooks.lifecycle.initContainer.emit(_extends$4({}, initContainerOptions, {
                remoteEntryExports
            }));
        }
        this.lib = remoteEntryExports;
        this.inited = true;
        // get exposeGetter
        const moduleFactory = await remoteEntryExports.get(expose);
        share.assert(moduleFactory, `${share.getFMId(this.remoteInfo)} remote don't export ${expose}.`);
        if (!loadFactory) return moduleFactory;
        const exposeContent = await moduleFactory();
        return exposeContent;
    }
    constructor({ remoteInfo, host }){
        this.inited = false;
        this.lib = undefined;
        this.remoteInfo = remoteInfo;
        this.host = host;
    }
};
class SyncHook {
    on(fn) {
        if (typeof fn === 'function') this.listeners.add(fn);
    }
    once(fn) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.on(function wrapper(...args) {
            self.remove(wrapper);
            // eslint-disable-next-line prefer-spread
            return fn.apply(null, args);
        });
    }
    emit(...data) {
        let result;
        if (this.listeners.size > 0) // eslint-disable-next-line prefer-spread
        this.listeners.forEach((fn)=>{
            result = fn(...data);
        });
        return result;
    }
    remove(fn) {
        this.listeners.delete(fn);
    }
    removeAll() {
        this.listeners.clear();
    }
    constructor(type){
        this.type = '';
        this.listeners = new Set();
        if (type) this.type = type;
    }
}
class AsyncHook extends SyncHook {
    emit(...data) {
        let result;
        const ls = Array.from(this.listeners);
        if (ls.length > 0) {
            let i = 0;
            const call = (prev)=>{
                if (prev === false) return false; // Abort process
                else if (i < ls.length) return Promise.resolve(ls[i++].apply(null, data)).then(call);
                else return prev;
            };
            result = call();
        }
        return Promise.resolve(result);
    }
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function checkReturnData(originalData, returnedData) {
    if (!share.isObject(returnedData)) return false;
    if (originalData !== returnedData) // eslint-disable-next-line no-restricted-syntax
    for(const key in originalData){
        if (!(key in returnedData)) return false;
    }
    return true;
}
class SyncWaterfallHook extends SyncHook {
    emit(data) {
        if (!share.isObject(data)) share.error(`The data for the "${this.type}" hook should be an object.`);
        for (const fn of this.listeners)try {
            const tempData = fn(data);
            if (checkReturnData(data, tempData)) data = tempData;
            else {
                this.onerror(`A plugin returned an unacceptable value for the "${this.type}" type.`);
                break;
            }
        } catch (e) {
            share.warn(e);
            this.onerror(e);
        }
        return data;
    }
    constructor(type){
        super();
        this.onerror = share.error;
        this.type = type;
    }
}
class AsyncWaterfallHook extends SyncHook {
    emit(data) {
        if (!share.isObject(data)) share.error(`The response data for the "${this.type}" hook must be an object.`);
        const ls = Array.from(this.listeners);
        if (ls.length > 0) {
            let i = 0;
            const processError = (e)=>{
                share.warn(e);
                this.onerror(e);
                return data;
            };
            const call = (prevData)=>{
                if (checkReturnData(data, prevData)) {
                    data = prevData;
                    if (i < ls.length) try {
                        return Promise.resolve(ls[i++](data)).then(call, processError);
                    } catch (e) {
                        return processError(e);
                    }
                } else this.onerror(`A plugin returned an incorrect value for the "${this.type}" type.`);
                return data;
            };
            return Promise.resolve(call(data));
        }
        return Promise.resolve(data);
    }
    constructor(type){
        super();
        this.onerror = share.error;
        this.type = type;
    }
}
class PluginSystem {
    applyPlugin(plugin) {
        share.assert(share.isPlainObject(plugin), 'Plugin configuration is invalid.');
        // The plugin's name is mandatory and must be unique
        const pluginName = plugin.name;
        share.assert(pluginName, 'A name must be provided by the plugin.');
        if (!this.registerPlugins[pluginName]) {
            this.registerPlugins[pluginName] = plugin;
            Object.keys(this.lifecycle).forEach((key)=>{
                const pluginLife = plugin[key];
                if (pluginLife) this.lifecycle[key].on(pluginLife);
            });
        }
    }
    removePlugin(pluginName) {
        share.assert(pluginName, 'A name is required.');
        const plugin = this.registerPlugins[pluginName];
        share.assert(plugin, `The plugin "${pluginName}" is not registered.`);
        Object.keys(plugin).forEach((key)=>{
            if (key !== 'name') this.lifecycle[key].remove(plugin[key]);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    inherit({ lifecycle, registerPlugins }) {
        Object.keys(lifecycle).forEach((hookName)=>{
            share.assert(!this.lifecycle[hookName], `The hook "${hookName}" has a conflict and cannot be inherited.`);
            this.lifecycle[hookName] = lifecycle[hookName];
        });
        Object.keys(registerPlugins).forEach((pluginName)=>{
            share.assert(!this.registerPlugins[pluginName], `The plugin "${pluginName}" has a conflict and cannot be inherited.`);
            this.applyPlugin(registerPlugins[pluginName]);
        });
    }
    constructor(lifecycle){
        this.registerPlugins = {};
        this.lifecycle = lifecycle;
        this.lifecycleKeys = Object.keys(lifecycle);
    }
}
function _extends$3() {
    _extends$3 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$3.apply(this, arguments);
}
function defaultPreloadArgs(preloadConfig) {
    return _extends$3({
        resourceCategory: 'sync',
        share: true,
        depsRemote: true,
        prefetchInterface: false
    }, preloadConfig);
}
function formatPreloadArgs(remotes, preloadArgs) {
    return preloadArgs.map((args)=>{
        const remoteInfo = matchRemote(remotes, args.nameOrAlias);
        share.assert(remoteInfo, `Unable to preload ${args.nameOrAlias} as it is not included in ${!remoteInfo && share.safeToString({
            remoteInfo,
            remotes
        })}`);
        return {
            remote: remoteInfo,
            preloadConfig: defaultPreloadArgs(args)
        };
    });
}
function normalizePreloadExposes(exposes) {
    if (!exposes) return [];
    return exposes.map((expose)=>{
        if (expose === '.') return expose;
        if (expose.startsWith('./')) return expose.replace('./', '');
        return expose;
    });
}
function preloadAssets(remoteInfo, host, assets) {
    const { cssAssets, jsAssetsWithoutEntry, entryAssets } = assets;
    if (host.options.inBrowser) {
        entryAssets.forEach((asset)=>{
            const { moduleInfo } = asset;
            const module = host.moduleCache.get(remoteInfo.name);
            if (module) getRemoteEntry({
                remoteInfo: moduleInfo,
                remoteEntryExports: module.remoteEntryExports,
                createScriptHook: (url)=>{
                    const res = host.loaderHook.lifecycle.createScript.emit({
                        url
                    });
                    if (res instanceof HTMLScriptElement) return res;
                    return;
                }
            });
            else getRemoteEntry({
                remoteInfo: moduleInfo,
                remoteEntryExports: undefined,
                createScriptHook: (url)=>{
                    const res = host.loaderHook.lifecycle.createScript.emit({
                        url
                    });
                    if (res instanceof HTMLScriptElement) return res;
                    return;
                }
            });
        });
        const fragment = document.createDocumentFragment();
        cssAssets.forEach((cssUrl)=>{
            const cssEl = document.createElement('link');
            cssEl.setAttribute('rel', 'preload');
            cssEl.setAttribute('href', cssUrl);
            cssEl.setAttribute('as', 'style');
            fragment.appendChild(cssEl);
        });
        document.head.appendChild(fragment);
        jsAssetsWithoutEntry.forEach((jsUrl)=>{
            const { script: scriptEl } = sdk.createScript(jsUrl, ()=>{
            // noop
            }, {}, (url)=>{
                const res = host.loaderHook.lifecycle.createScript.emit({
                    url
                });
                if (res instanceof HTMLScriptElement) return res;
                return;
            });
            document.head.appendChild(scriptEl);
        });
    }
}
function _extends$2() {
    _extends$2 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$2.apply(this, arguments);
}
function assignRemoteInfo(remoteInfo, remoteSnapshot) {
    if (!('remoteEntry' in remoteSnapshot) || !remoteSnapshot.remoteEntry) share.error(`The attribute remoteEntry of ${name} must not be undefined.`);
    const { remoteEntry } = remoteSnapshot;
    const entryUrl = sdk.getResourceUrl(remoteSnapshot, remoteEntry);
    remoteInfo.type = remoteSnapshot.remoteEntryType;
    remoteInfo.entryGlobalName = remoteSnapshot.globalName;
    remoteInfo.entry = entryUrl;
    remoteInfo.version = remoteSnapshot.version;
    remoteInfo.buildVersion = remoteSnapshot.buildVersion;
}
function snapshotPlugin() {
    return {
        name: 'snapshot-plugin',
        async afterResolve (args) {
            const { remote, pkgNameOrAlias, expose, origin, remoteInfo } = args;
            if (!share.isRemoteInfoWithEntry(remote) || !share.isPureRemoteEntry(remote)) {
                const { remoteSnapshot, globalSnapshot } = await origin.snapshotHandler.loadRemoteSnapshotInfo(remote);
                assignRemoteInfo(remoteInfo, remoteSnapshot);
                // preloading assets
                const preloadOptions = {
                    remote,
                    preloadConfig: {
                        nameOrAlias: pkgNameOrAlias,
                        exposes: [
                            expose
                        ],
                        resourceCategory: 'sync',
                        share: false,
                        depsRemote: false
                    }
                };
                const assets = await origin.hooks.lifecycle.generatePreloadAssets.emit({
                    origin,
                    preloadOptions,
                    remoteInfo,
                    remote,
                    remoteSnapshot,
                    globalSnapshot
                });
                if (assets) preloadAssets(remoteInfo, origin, assets);
                return _extends$2({}, args, {
                    remoteSnapshot
                });
            }
            return args;
        }
    };
}
// name
// name:version
function splitId(id) {
    const splitInfo = id.split(':');
    if (splitInfo.length === 1) return {
        name: splitInfo[0],
        version: undefined
    };
    else if (splitInfo.length === 2) return {
        name: splitInfo[0],
        version: splitInfo[1]
    };
    else return {
        name: splitInfo[1],
        version: splitInfo[2]
    };
}
// Traverse all nodes in moduleInfo and traverse the entire snapshot
function traverseModuleInfo(globalSnapshot, remoteInfo, traverse, isRoot, memo = {}, remoteSnapshot, getModuleInfoHook) {
    const id = share.getFMId(remoteInfo);
    const { value: snapshotValue } = share.getInfoWithoutType(globalSnapshot, id, getModuleInfoHook);
    const effectiveRemoteSnapshot = remoteSnapshot || snapshotValue;
    if (effectiveRemoteSnapshot && !sdk.isManifestProvider(effectiveRemoteSnapshot)) {
        traverse(effectiveRemoteSnapshot, remoteInfo, isRoot);
        if (effectiveRemoteSnapshot.remotesInfo) {
            const remoteKeys = Object.keys(effectiveRemoteSnapshot.remotesInfo);
            for (const key of remoteKeys){
                if (memo[key]) continue;
                memo[key] = true;
                const subRemoteInfo = splitId(key);
                const remoteValue = effectiveRemoteSnapshot.remotesInfo[key];
                traverseModuleInfo(globalSnapshot, {
                    name: subRemoteInfo.name,
                    version: remoteValue.matchedVersion
                }, traverse, false, memo, undefined, getModuleInfoHook);
            }
        }
    }
}
// eslint-disable-next-line max-lines-per-function
function generatePreloadAssets(origin, preloadOptions, remote, globalSnapshot, remoteSnapshot) {
    const cssAssets = [];
    const jsAssets = [];
    const entryAssets = [];
    const loadedSharedJsAssets = new Set();
    const loadedSharedCssAssets = new Set();
    const { options } = origin;
    const { preloadConfig: rootPreloadConfig } = preloadOptions;
    const { depsRemote } = rootPreloadConfig;
    const memo = {};
    traverseModuleInfo(globalSnapshot, remote, (moduleInfoSnapshot, remoteInfo, isRoot)=>{
        let preloadConfig;
        if (isRoot) preloadConfig = rootPreloadConfig;
        else {
            if (Array.isArray(depsRemote)) {
                // eslint-disable-next-line array-callback-return
                const findPreloadConfig = depsRemote.find((remoteConfig)=>{
                    if (remoteConfig.nameOrAlias === remoteInfo.name || remoteConfig.nameOrAlias === remoteInfo.alias) return true;
                    return false;
                });
                if (!findPreloadConfig) return;
                preloadConfig = defaultPreloadArgs(findPreloadConfig);
            } else if (depsRemote === true) preloadConfig = rootPreloadConfig;
            else return;
        }
        const remoteEntryUrl = sdk.getResourceUrl(moduleInfoSnapshot, 'remoteEntry' in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntry : '');
        if (remoteEntryUrl) entryAssets.push({
            name: remoteInfo.name,
            moduleInfo: {
                name: remoteInfo.name,
                entry: remoteEntryUrl,
                type: 'remoteEntryType' in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntryType : 'global',
                entryGlobalName: 'globalName' in moduleInfoSnapshot ? moduleInfoSnapshot.globalName : remoteInfo.name,
                shareScope: '',
                version: 'version' in moduleInfoSnapshot ? moduleInfoSnapshot.version : undefined
            },
            url: remoteEntryUrl
        });
        let moduleAssetsInfo = 'modules' in moduleInfoSnapshot ? moduleInfoSnapshot.modules : [];
        const normalizedPreloadExposes = normalizePreloadExposes(preloadConfig.exposes);
        if (normalizedPreloadExposes.length && 'modules' in moduleInfoSnapshot) {
            var _moduleInfoSnapshot_modules;
            moduleAssetsInfo = moduleInfoSnapshot == null ? void 0 : (_moduleInfoSnapshot_modules = moduleInfoSnapshot.modules) == null ? void 0 : _moduleInfoSnapshot_modules.reduce((assets, moduleAssetInfo)=>{
                if ((normalizedPreloadExposes == null ? void 0 : normalizedPreloadExposes.indexOf(moduleAssetInfo.moduleName)) !== -1) assets.push(moduleAssetInfo);
                return assets;
            }, []);
        }
        function handleAssets(assets) {
            const assetsRes = assets.map((asset)=>sdk.getResourceUrl(moduleInfoSnapshot, asset));
            if (preloadConfig.filter) return assetsRes.filter(preloadConfig.filter);
            return assetsRes;
        }
        if (moduleAssetsInfo) {
            const assetsLength = moduleAssetsInfo.length;
            for(let index = 0; index < assetsLength; index++){
                const assetsInfo = moduleAssetsInfo[index];
                const exposeFullPath = `${remoteInfo.name}/${assetsInfo.moduleName}`;
                origin.hooks.lifecycle.handlePreloadModule.emit({
                    id: assetsInfo.moduleName === '.' ? remoteInfo.name : exposeFullPath,
                    name: remoteInfo.name,
                    remoteSnapshot: moduleInfoSnapshot,
                    preloadConfig
                });
                const preloaded = share.getPreloaded(exposeFullPath);
                if (preloaded) continue;
                if (preloadConfig.resourceCategory === 'all') {
                    cssAssets.push(...handleAssets(assetsInfo.assets.css.async));
                    cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
                    jsAssets.push(...handleAssets(assetsInfo.assets.js.async));
                    jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
                // eslint-disable-next-line no-constant-condition
                } else {
                    preloadConfig.resourceCategory = 'sync';
                    cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
                    jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
                }
                share.setPreloaded(exposeFullPath);
            }
        }
    }, true, memo, remoteSnapshot, (target, key)=>{
        const res = origin.loaderHook.lifecycle.getModuleInfo.emit({
            target,
            key
        });
        if (res && !(res instanceof Promise)) return res;
        return;
    });
    if (remoteSnapshot.shared) remoteSnapshot.shared.forEach((shared)=>{
        var _options_shared;
        const shareInfo = (_options_shared = options.shared) == null ? void 0 : _options_shared[shared.sharedName];
        // When data is downgraded, the shared configuration may be different.
        if (!shareInfo) return;
        const registeredShared = share.getRegisteredShare(origin.shareScopeMap, shared.sharedName, shareInfo, origin.hooks.lifecycle.resolveShare);
        // If the global share does not exist, or the lib function does not exist, it means that the shared has not been loaded yet and can be preloaded.
        if (registeredShared && typeof registeredShared.lib === 'function') {
            shared.assets.js.sync.forEach((asset)=>{
                loadedSharedJsAssets.add(asset);
            });
            shared.assets.css.sync.forEach((asset)=>{
                loadedSharedCssAssets.add(asset);
            });
        }
    });
    const needPreloadJsAssets = jsAssets.filter((asset)=>!loadedSharedJsAssets.has(asset));
    const needPreloadCssAssets = cssAssets.filter((asset)=>!loadedSharedCssAssets.has(asset));
    return {
        cssAssets: needPreloadCssAssets,
        jsAssetsWithoutEntry: needPreloadJsAssets,
        entryAssets
    };
}
const generatePreloadAssetsPlugin = function() {
    return {
        name: 'generate-preload-assets-plugin',
        async generatePreloadAssets (args) {
            const { origin, preloadOptions, remoteInfo, remote, globalSnapshot, remoteSnapshot } = args;
            if (share.isRemoteInfoWithEntry(remote) && share.isPureRemoteEntry(remote)) return {
                cssAssets: [],
                jsAssetsWithoutEntry: [],
                entryAssets: [
                    {
                        name: remote.name,
                        url: remote.entry,
                        moduleInfo: {
                            name: remoteInfo.name,
                            entry: remote.entry,
                            type: 'global',
                            entryGlobalName: '',
                            shareScope: ''
                        }
                    }
                ]
            };
            assignRemoteInfo(remoteInfo, remoteSnapshot);
            const assets = generatePreloadAssets(origin, preloadOptions, remoteInfo, globalSnapshot, remoteSnapshot);
            return assets;
        }
    };
};
function _extends$1() {
    _extends$1 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$1.apply(this, arguments);
}
class SnapshotHandler {
    async loadSnapshot(moduleInfo) {
        const { options } = this.HostInstance;
        const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
        const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
            options,
            moduleInfo,
            hostGlobalSnapshot,
            remoteSnapshot,
            globalSnapshot
        });
        return {
            remoteSnapshot: globalRemoteSnapshot,
            globalSnapshot: globalSnapshotRes
        };
    }
    // eslint-disable-next-line max-lines-per-function
    async loadRemoteSnapshotInfo(moduleInfo) {
        const { options } = this.HostInstance;
        const hostSnapshot = share.getGlobalSnapshotInfoByModuleInfo({
            name: this.HostInstance.options.name,
            version: this.HostInstance.options.version
        }, {
            getModuleInfoHook: (target, key)=>{
                const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                    target,
                    key
                });
                if (res && !(res instanceof Promise)) return res;
                return;
            }
        });
        await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
            options,
            moduleInfo
        });
        // In dynamic loadRemote scenarios, incomplete remotesInfo delivery may occur. In such cases, the remotesInfo in the host needs to be completed in the snapshot at runtime.
        // This ensures the snapshot's integrity and helps the chrome plugin correctly identify all producer modules, ensuring that proxyable producer modules will not be missing.
        if (hostSnapshot && 'remotesInfo' in hostSnapshot && !share.getInfoWithoutType(hostSnapshot.remotesInfo, moduleInfo.name, (target, key)=>{
            const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                target,
                key
            });
            if (res && !(res instanceof Promise)) return res;
            return;
        }).value) {
            if ('version' in moduleInfo || 'entry' in moduleInfo) hostSnapshot.remotesInfo = _extends$1({}, hostSnapshot == null ? void 0 : hostSnapshot.remotesInfo, {
                [moduleInfo.name]: {
                    matchedVersion: 'version' in moduleInfo ? moduleInfo.version : moduleInfo.entry
                }
            });
        }
        const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
        const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
            options,
            moduleInfo,
            hostGlobalSnapshot,
            remoteSnapshot,
            globalSnapshot
        });
        // global snapshot includes manifest or module info includes manifest
        if (globalRemoteSnapshot) {
            if (sdk.isManifestProvider(globalRemoteSnapshot)) {
                const moduleSnapshot = await this.getManifestJson(globalRemoteSnapshot.remoteEntry, moduleInfo, {});
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const globalSnapshotRes = share.setGlobalSnapshotInfoByModuleInfo(_extends$1({}, moduleInfo), moduleSnapshot);
                return {
                    remoteSnapshot: moduleSnapshot,
                    globalSnapshot: globalSnapshotRes
                };
            } else {
                const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
                    options: this.HostInstance.options,
                    moduleInfo,
                    remoteSnapshot: globalRemoteSnapshot,
                    from: 'global'
                });
                return {
                    remoteSnapshot: remoteSnapshotRes,
                    globalSnapshot: globalSnapshotRes
                };
            }
        } else if (share.isRemoteInfoWithEntry(moduleInfo)) {
            // get from manifest.json and merge remote info from remote server
            const moduleSnapshot = await this.getManifestJson(moduleInfo.entry, moduleInfo, {});
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const globalSnapshotRes = share.setGlobalSnapshotInfoByModuleInfo(moduleInfo, moduleSnapshot);
            const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
                options: this.HostInstance.options,
                moduleInfo,
                remoteSnapshot: moduleSnapshot,
                from: 'global'
            });
            return {
                remoteSnapshot: remoteSnapshotRes,
                globalSnapshot: globalSnapshotRes
            };
        } else share.error(`
          Cannot get remoteSnapshot with the name: '${moduleInfo.name}', version: '${moduleInfo.version}' from __FEDERATION__.moduleInfo. The following reasons may be causing the problem:\n
          1. The Deploy platform did not deliver the correct data. You can use __FEDERATION__.moduleInfo to check the remoteInfo.\n
          2. The remote '${moduleInfo.name}' version '${moduleInfo.version}' is not released.\n
          The transformed module info: ${JSON.stringify(globalSnapshotRes)}
        `);
    }
    getGlobalRemoteInfo(moduleInfo) {
        const hostGlobalSnapshot = share.getGlobalSnapshotInfoByModuleInfo({
            name: this.HostInstance.options.name,
            version: this.HostInstance.options.version
        }, {
            getModuleInfoHook: (target, key)=>{
                const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                    target,
                    key
                });
                if (res && !(res instanceof Promise)) return res;
                return;
            }
        });
        // get remote detail info from global
        const globalRemoteInfo = hostGlobalSnapshot && 'remotesInfo' in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && share.getInfoWithoutType(hostGlobalSnapshot.remotesInfo, moduleInfo.name, (target, key)=>{
            const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                target,
                key
            });
            if (res && !(res instanceof Promise)) return res;
            return;
        }).value;
        if (globalRemoteInfo && globalRemoteInfo.matchedVersion) return {
            hostGlobalSnapshot,
            globalSnapshot: share.getGlobalSnapshot(),
            remoteSnapshot: share.getGlobalSnapshotInfoByModuleInfo({
                name: moduleInfo.name,
                version: globalRemoteInfo.matchedVersion
            }, {
                getModuleInfoHook: (target, key)=>{
                    const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                        target,
                        key
                    });
                    if (res && !(res instanceof Promise)) return res;
                    return;
                }
            })
        };
        return {
            hostGlobalSnapshot: undefined,
            globalSnapshot: share.getGlobalSnapshot(),
            remoteSnapshot: share.getGlobalSnapshotInfoByModuleInfo({
                name: moduleInfo.name,
                version: 'version' in moduleInfo ? moduleInfo.version : undefined
            }, {
                getModuleInfoHook: (target, key)=>{
                    const res = this.HostInstance.loaderHook.lifecycle.getModuleInfo.emit({
                        target,
                        key
                    });
                    if (res && !(res instanceof Promise)) return res;
                    return;
                }
            })
        };
    }
    async getManifestJson(manifestUrl, moduleInfo, extraOptions) {
        const getManifest = async ()=>{
            let manifestJson = this.manifestCache.get(manifestUrl);
            if (manifestJson) return manifestJson;
            try {
                let res = await this.loaderHook.lifecycle.fetch.emit(manifestUrl, {});
                if (!res || !(res instanceof Response)) res = await fetch(manifestUrl, {});
                manifestJson = await res.json();
                share.assert(manifestJson.metaData && manifestJson.exposes && manifestJson.shared, `${manifestUrl} is not a federation manifest`);
                this.manifestCache.set(manifestUrl, manifestJson);
                return manifestJson;
            } catch (err) {
                share.error(`Failed to get manifestJson for ${moduleInfo.name}. The manifest URL is ${manifestUrl}. Please ensure that the manifestUrl is accessible.
          \n Error message:
          \n ${err}`);
            }
        };
        const asyncLoadProcess = async ()=>{
            const manifestJson = await getManifest();
            const remoteSnapshot = sdk.generateSnapshotFromManifest(manifestJson, {
                version: manifestUrl
            });
            const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
                options: this.HostInstance.options,
                moduleInfo,
                manifestJson,
                remoteSnapshot,
                manifestUrl,
                from: 'manifest'
            });
            return remoteSnapshotRes;
        };
        if (!this.manifestLoading[manifestUrl]) this.manifestLoading[manifestUrl] = asyncLoadProcess().then((res)=>res);
        return this.manifestLoading[manifestUrl];
    }
    constructor(HostInstance){
        this.loadingHostSnapshot = null;
        this.manifestCache = new Map();
        this.hooks = new PluginSystem({
            beforeLoadRemoteSnapshot: new AsyncHook('beforeLoadRemoteSnapshot'),
            loadSnapshot: new AsyncWaterfallHook('loadGlobalSnapshot'),
            loadRemoteSnapshot: new AsyncWaterfallHook('loadRemoteSnapshot')
        });
        this.manifestLoading = share.Global.__FEDERATION__.__MANIFEST_LOADING__;
        this.HostInstance = HostInstance;
        this.loaderHook = HostInstance.loaderHook;
    }
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
class FederationHost {
    _setGlobalShareScopeMap() {
        const globalShareScopeMap = share.getGlobalShareScope();
        const identifier = this.options.id || this.options.name;
        if (identifier && !globalShareScopeMap[identifier]) globalShareScopeMap[identifier] = this.shareScopeMap;
    }
    initOptions(userOptions) {
        this.registerPlugins(userOptions.plugins);
        const options = this.formatOptions(this.options, userOptions);
        this.options = options;
        return options;
    }
    async loadShare(pkgName, customShareInfo) {
        var _this_options_shared;
        // This function performs the following steps:
        // 1. Checks if the currently loaded share already exists, if not, it throws an error
        // 2. Searches globally for a matching share, if found, it uses it directly
        // 3. If not found, it retrieves it from the current share and stores the obtained share globally.
        const shareInfo = Object.assign({}, (_this_options_shared = this.options.shared) == null ? void 0 : _this_options_shared[pkgName], customShareInfo);
        if (shareInfo == null ? void 0 : shareInfo.scope) await Promise.all(shareInfo.scope.map(async (shareScope)=>{
            await Promise.all(this.initializeSharing(shareScope, shareInfo.strategy));
            return;
        }));
        const loadShareRes = await this.hooks.lifecycle.beforeLoadShare.emit({
            pkgName,
            shareInfo,
            shared: this.options.shared,
            origin: this
        });
        const { shareInfo: shareInfoRes } = loadShareRes;
        // Assert that shareInfoRes exists, if not, throw an error
        share.assert(shareInfoRes, `Cannot find ${pkgName} Share in the ${this.options.name}. Please ensure that the ${pkgName} Share parameters have been injected`);
        // Retrieve from cache
        const registeredShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
        const addUseIn = (shared)=>{
            if (!shared.useIn) shared.useIn = [];
            share.addUniqueItem(shared.useIn, this.options.name);
        };
        if (registeredShared && registeredShared.lib) {
            addUseIn(registeredShared);
            return registeredShared.lib;
        } else if (registeredShared && registeredShared.loading && !registeredShared.loaded) {
            const factory = await registeredShared.loading;
            registeredShared.loaded = true;
            if (!registeredShared.lib) registeredShared.lib = factory;
            addUseIn(registeredShared);
            return factory;
        } else if (registeredShared) {
            const asyncLoadProcess = async ()=>{
                const factory = await registeredShared.get();
                shareInfoRes.lib = factory;
                shareInfoRes.loaded = true;
                addUseIn(shareInfoRes);
                const gShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
                if (gShared) {
                    gShared.lib = factory;
                    gShared.loaded = true;
                }
                return factory;
            };
            const loading = asyncLoadProcess();
            this.setShared({
                pkgName,
                loaded: false,
                shared: registeredShared,
                from: this.options.name,
                lib: null,
                loading
            });
            return loading;
        } else {
            if (customShareInfo) return false;
            const asyncLoadProcess = async ()=>{
                const factory = await shareInfoRes.get();
                shareInfoRes.lib = factory;
                shareInfoRes.loaded = true;
                addUseIn(shareInfoRes);
                const gShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfoRes, this.hooks.lifecycle.resolveShare);
                if (gShared) {
                    gShared.lib = factory;
                    gShared.loaded = true;
                }
                return factory;
            };
            const loading = asyncLoadProcess();
            this.setShared({
                pkgName,
                loaded: false,
                shared: shareInfoRes,
                from: this.options.name,
                lib: null,
                loading
            });
            return loading;
        }
    }
    // The lib function will only be available if the shared set by eager or runtime init is set or the shared is successfully loaded.
    // 1. If the loaded shared already exists globally, then it will be reused
    // 2. If lib exists in local shared, it will be used directly
    // 3. If the local get returns something other than Promise, then it will be used directly
    loadShareSync(pkgName, customShareInfo) {
        var _this_options_shared;
        const shareInfo = Object.assign({}, (_this_options_shared = this.options.shared) == null ? void 0 : _this_options_shared[pkgName], customShareInfo);
        if (shareInfo == null ? void 0 : shareInfo.scope) shareInfo.scope.forEach((shareScope)=>{
            this.initializeSharing(shareScope, shareInfo.strategy);
        });
        const registeredShared = share.getRegisteredShare(this.shareScopeMap, pkgName, shareInfo, this.hooks.lifecycle.resolveShare);
        const addUseIn = (shared)=>{
            if (!shared.useIn) shared.useIn = [];
            share.addUniqueItem(shared.useIn, this.options.name);
        };
        if (registeredShared) {
            if (typeof registeredShared.lib === 'function') {
                addUseIn(registeredShared);
                if (!registeredShared.loaded) {
                    registeredShared.loaded = true;
                    if (registeredShared.from === this.options.name) shareInfo.loaded = true;
                }
                return registeredShared.lib;
            }
            if (typeof registeredShared.get === 'function') {
                const module = registeredShared.get();
                if (!(module instanceof Promise)) {
                    addUseIn(registeredShared);
                    this.setShared({
                        pkgName,
                        loaded: true,
                        from: this.options.name,
                        lib: module,
                        shared: registeredShared
                    });
                    return module;
                }
            }
        }
        if (shareInfo.lib) {
            if (!shareInfo.loaded) shareInfo.loaded = true;
            return shareInfo.lib;
        }
        if (shareInfo.get) {
            const module = shareInfo.get();
            if (module instanceof Promise) throw new Error(`
        The loadShareSync function was unable to load ${pkgName}. The ${pkgName} could not be found in ${this.options.name}.
        Possible reasons for failure: \n
        1. The ${pkgName} share was registered with the 'get' attribute, but loadShare was not used beforehand.\n
        2. The ${pkgName} share was not registered with the 'lib' attribute.\n
      `);
            shareInfo.lib = module;
            this.setShared({
                pkgName,
                loaded: true,
                from: this.options.name,
                lib: shareInfo.lib,
                shared: shareInfo
            });
            return shareInfo.lib;
        }
        throw new Error(`
        The loadShareSync function was unable to load ${pkgName}. The ${pkgName} could not be found in ${this.options.name}.
        Possible reasons for failure: \n
        1. The ${pkgName} share was registered with the 'get' attribute, but loadShare was not used beforehand.\n
        2. The ${pkgName} share was not registered with the 'lib' attribute.\n
      `);
    }
    async _getRemoteModuleAndOptions(id) {
        const loadRemoteArgs = await this.hooks.lifecycle.beforeRequest.emit({
            id,
            options: this.options,
            origin: this
        });
        const { id: idRes } = loadRemoteArgs;
        const remoteSplitInfo = matchRemoteWithNameAndExpose(this.options.remotes, idRes);
        share.assert(remoteSplitInfo, `
        Unable to locate ${idRes} in ${this.options.name}. Potential reasons for failure include:\n
        1. ${idRes} was not included in the 'remotes' parameter of ${this.options.name || 'the host'}.\n
        2. ${idRes} could not be found in the 'remotes' of ${this.options.name} with either 'name' or 'alias' attributes.
        3. ${idRes} is not online, injected, or loaded.
        4. ${idRes}  cannot be accessed on the expected.
        5. The 'beforeRequest' hook was provided but did not return the correct 'remoteInfo' when attempting to load ${idRes}.
      `);
        const { remote: rawRemote } = remoteSplitInfo;
        const remoteInfo = getRemoteInfo(rawRemote);
        const matchInfo = await this.hooks.lifecycle.afterResolve.emit(_extends({
            id: idRes
        }, remoteSplitInfo, {
            options: this.options,
            origin: this,
            remoteInfo
        }));
        const { remote, expose } = matchInfo;
        share.assert(remote && expose, `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${idRes}.`);
        let module = this.moduleCache.get(remote.name);
        const moduleOptions = {
            host: this,
            remoteInfo
        };
        if (!module) {
            module = new Module(moduleOptions);
            this.moduleCache.set(remote.name, module);
        }
        return {
            module,
            moduleOptions,
            remoteMatchInfo: matchInfo
        };
    }
    // eslint-disable-next-line max-lines-per-function
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async loadRemote(id, options) {
        try {
            const { loadFactory = true } = options || {
                loadFactory: true
            };
            // 1. Validate the parameters of the retrieved module. There are two module request methods: pkgName + expose and alias + expose.
            // 2. Request the snapshot information of the current host and globally store the obtained snapshot information. The retrieved module information is partially offline and partially online. The online module information will retrieve the modules used online.
            // 3. Retrieve the detailed information of the current module from global (remoteEntry address, expose resource address)
            // 4. After retrieving remoteEntry, call the init of the module, and then retrieve the exported content of the module through get
            // id: pkgName(@federation/app1) + expose(button) = @federation/app1/button
            // id: alias(app1) + expose(button) = app1/button
            // id: alias(app1/utils) + expose(loadash/sort) = app1/utils/loadash/sort
            const { module, moduleOptions, remoteMatchInfo } = await this._getRemoteModuleAndOptions(id);
            const { pkgNameOrAlias, remote, expose, id: idRes } = remoteMatchInfo;
            const moduleOrFactory = await module.get(expose, options);
            await this.hooks.lifecycle.onLoad.emit({
                id: idRes,
                pkgNameOrAlias,
                expose,
                exposeModule: loadFactory ? moduleOrFactory : undefined,
                exposeModuleFactory: loadFactory ? undefined : moduleOrFactory,
                remote,
                options: moduleOptions,
                moduleInstance: module,
                origin: this
            });
            return moduleOrFactory;
        } catch (error) {
            const { from = 'runtime' } = options || {
                from: 'runtime'
            };
            const failOver = await this.hooks.lifecycle.errorLoadRemote.emit({
                id,
                error,
                from,
                origin: this
            });
            if (!failOver) throw error;
            return failOver;
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async preloadRemote(preloadOptions) {
        await this.hooks.lifecycle.beforePreloadRemote.emit({
            preloadOptions,
            options: this.options,
            origin: this
        });
        const preloadOps = formatPreloadArgs(this.options.remotes, preloadOptions);
        await Promise.all(preloadOps.map(async (ops)=>{
            const { remote } = ops;
            const remoteInfo = getRemoteInfo(remote);
            const { globalSnapshot, remoteSnapshot } = await this.snapshotHandler.loadRemoteSnapshotInfo(remote);
            const assets = await this.hooks.lifecycle.generatePreloadAssets.emit({
                origin: this,
                preloadOptions: ops,
                remote,
                remoteInfo,
                globalSnapshot,
                remoteSnapshot
            });
            if (!assets) return;
            preloadAssets(remoteInfo, this, assets);
        }));
    }
    /**
   * This function initializes the sharing sequence (executed only once per share scope).
   * It accepts one argument, the name of the share scope.
   * If the share scope does not exist, it creates one.
   */ // eslint-disable-next-line @typescript-eslint/member-ordering
    initializeSharing(shareScopeName = share.DEFAULT_SCOPE, strategy) {
        const shareScope = this.shareScopeMap;
        const hostName = this.options.name;
        // Creates a new share scope if necessary
        if (!shareScope[shareScopeName]) shareScope[shareScopeName] = {};
        // Executes all initialization snippets from all accessible modules
        const scope = shareScope[shareScopeName];
        const register = (name1, shared)=>{
            var _activeVersion_shareConfig;
            const { version, eager } = shared;
            scope[name1] = scope[name1] || {};
            const versions = scope[name1];
            const activeVersion = versions[version];
            const activeVersionEager = Boolean(activeVersion && (activeVersion.eager || ((_activeVersion_shareConfig = activeVersion.shareConfig) == null ? void 0 : _activeVersion_shareConfig.eager)));
            if (!activeVersion || !activeVersion.loaded && (Boolean(!eager) !== !activeVersionEager ? eager : hostName > activeVersion.from)) versions[version] = shared;
        };
        const promises = [];
        const initFn = (mod)=>mod && mod.init && mod.init(shareScope[shareScopeName]);
        const initRemoteModule = async (key)=>{
            const { module } = await this._getRemoteModuleAndOptions(key);
            if (module.getEntry) {
                const entry = await module.getEntry();
                if (!module.inited) {
                    initFn(entry);
                    module.inited = true;
                }
            }
        };
        Object.keys(this.options.shared).forEach((shareName)=>{
            const shared = this.options.shared[shareName];
            if (shared.scope.includes(shareScopeName)) register(shareName, shared);
        });
        if (strategy === 'version-first') this.options.remotes.forEach((remote)=>{
            if (remote.shareScope === shareScopeName) promises.push(initRemoteModule(remote.name));
        });
        return promises;
    }
    initShareScopeMap(scopeName, shareScope) {
        this.shareScopeMap[scopeName] = shareScope;
        this.hooks.lifecycle.initContainerShareScopeMap.emit({
            shareScope,
            options: this.options,
            origin: this
        });
    }
    formatOptions(globalOptions, userOptions) {
        const formatShareOptions = share.formatShareConfigs(userOptions.shared || {}, userOptions.name);
        const shared = _extends({}, globalOptions.shared, formatShareOptions);
        const { userOptions: userOptionsRes, options: globalOptionsRes } = this.hooks.lifecycle.beforeInit.emit({
            origin: this,
            userOptions,
            options: globalOptions,
            shareInfo: shared
        });
        const userRemotes = userOptionsRes.remotes || [];
        const remotes = userRemotes.reduce((res, remote)=>{
            if (!res.find((item)=>item.name === remote.name)) {
                if (remote.alias) {
                    // Validate if alias equals the prefix of remote.name and remote.alias, if so, throw an error
                    // As multi-level path references cannot guarantee unique names, alias being a prefix of remote.name is not supported
                    const findEqual = res.find((item)=>{
                        var _item_alias;
                        return remote.alias && (item.name.startsWith(remote.alias) || ((_item_alias = item.alias) == null ? void 0 : _item_alias.startsWith(remote.alias)));
                    });
                    share.assert(!findEqual, `The alias ${remote.alias} of remote ${remote.name} is not allowed to be the prefix of ${findEqual && findEqual.name} name or alias`);
                }
                // Set the remote entry to a complete path
                if ('entry' in remote) {
                    if (share.isBrowserEnv()) remote.entry = new URL(remote.entry, window.location.origin).href;
                }
                if (!remote.shareScope) remote.shareScope = share.DEFAULT_SCOPE;
                if (!remote.type) remote.type = share.DEFAULT_REMOTE_TYPE;
                res.push(remote);
            }
            return res;
        }, globalOptionsRes.remotes);
        // register shared in shareScopeMap
        const sharedKeys = Object.keys(formatShareOptions);
        sharedKeys.forEach((sharedKey)=>{
            const sharedVal = formatShareOptions[sharedKey];
            const registeredShared = share.getRegisteredShare(this.shareScopeMap, sharedKey, sharedVal, this.hooks.lifecycle.resolveShare);
            if (!registeredShared && sharedVal && sharedVal.lib) this.setShared({
                pkgName: sharedKey,
                lib: sharedVal.lib,
                get: sharedVal.get,
                loaded: true,
                shared: sharedVal,
                from: userOptions.name
            });
        });
        const plugins = [
            ...globalOptionsRes.plugins
        ];
        if (userOptionsRes.plugins) userOptionsRes.plugins.forEach((plugin)=>{
            if (!plugins.includes(plugin)) plugins.push(plugin);
        });
        const optionsRes = _extends({}, globalOptions, userOptions, {
            plugins,
            remotes,
            shared
        });
        this.hooks.lifecycle.init.emit({
            origin: this,
            options: optionsRes
        });
        return optionsRes;
    }
    registerPlugins(plugins) {
        registerPlugins(plugins, [
            this.hooks,
            this.snapshotHandler.hooks,
            this.loaderHook
        ]);
    }
    setShared({ pkgName, shared, from, lib, loading, loaded, get }) {
        const { version, scope = 'default' } = shared, shareInfo = _object_without_properties_loose(shared, [
            "version",
            "scope"
        ]);
        const scopes = Array.isArray(scope) ? scope : [
            scope
        ];
        scopes.forEach((sc)=>{
            if (!this.shareScopeMap[sc]) this.shareScopeMap[sc] = {};
            if (!this.shareScopeMap[sc][pkgName]) this.shareScopeMap[sc][pkgName] = {};
            if (this.shareScopeMap[sc][pkgName][version]) return;
            this.shareScopeMap[sc][pkgName][version] = _extends({
                version,
                scope: [
                    'default'
                ]
            }, shareInfo, {
                lib,
                loaded,
                loading
            });
            if (get) this.shareScopeMap[sc][pkgName][version].get = get;
        });
    }
    constructor(userOptions){
        this.hooks = new PluginSystem({
            beforeInit: new SyncWaterfallHook('beforeInit'),
            init: new SyncHook(),
            beforeRequest: new AsyncWaterfallHook('beforeRequest'),
            afterResolve: new AsyncWaterfallHook('afterResolve'),
            // maybe will change, temporarily for internal use only
            beforeInitContainer: new AsyncWaterfallHook('beforeInitContainer'),
            // maybe will change, temporarily for internal use only
            initContainerShareScopeMap: new AsyncWaterfallHook('initContainer'),
            // maybe will change, temporarily for internal use only
            initContainer: new AsyncWaterfallHook('initContainer'),
            onLoad: new AsyncHook('onLoad'),
            handlePreloadModule: new SyncHook('handlePreloadModule'),
            errorLoadRemote: new AsyncHook('errorLoadRemote'),
            beforeLoadShare: new AsyncWaterfallHook('beforeLoadShare'),
            // not used yet
            loadShare: new AsyncHook(),
            resolveShare: new SyncWaterfallHook('resolveShare'),
            beforePreloadRemote: new AsyncHook(),
            generatePreloadAssets: new AsyncHook('generatePreloadAssets'),
            // not used yet
            afterPreloadRemote: new AsyncHook()
        });
        this.version = "0.0.8";
        this.moduleCache = new Map();
        this.loaderHook = new PluginSystem({
            // FIXME: may not be suitable , not open to the public yet
            getModuleInfo: new SyncHook(),
            createScript: new SyncHook(),
            // only work for manifest , so not open to the public yet
            fetch: new AsyncHook('fetch')
        });
        // TODO: Validate the details of the options
        // Initialize options with default values
        const defaultOptions = {
            id: share.getBuilderId(),
            name: userOptions.name,
            plugins: [
                snapshotPlugin(),
                generatePreloadAssetsPlugin()
            ],
            remotes: [],
            shared: {},
            inBrowser: share.isBrowserEnv()
        };
        this.name = userOptions.name;
        this.options = defaultOptions;
        this.shareScopeMap = {};
        this._setGlobalShareScopeMap();
        this.snapshotHandler = new SnapshotHandler(this);
        this.registerPlugins([
            ...defaultOptions.plugins,
            ...userOptions.plugins || []
        ]);
        this.options = this.formatOptions(defaultOptions, userOptions);
    }
}
let FederationInstance = null;
function init(options) {
    // Retrieve the same instance with the same name
    const instance = share.getGlobalFederationInstance(options.name, options.version);
    if (!instance) {
        // Retrieve debug constructor
        const FederationConstructor = share.getGlobalFederationConstructor() || FederationHost;
        FederationInstance = new FederationConstructor(options);
        share.setGlobalFederationInstance(FederationInstance);
        return FederationInstance;
    } else {
        // Merge options
        instance.initOptions(options);
        if (!FederationInstance) FederationInstance = instance;
        return instance;
    }
}
function loadRemote(...args) {
    share.assert(FederationInstance, 'Please call init first');
    // eslint-disable-next-line prefer-spread
    return FederationInstance.loadRemote.apply(FederationInstance, args);
}
function loadShare(...args) {
    share.assert(FederationInstance, 'Please call init first');
    // eslint-disable-next-line prefer-spread
    return FederationInstance.loadShare.apply(FederationInstance, args);
}
function loadShareSync(...args) {
    share.assert(FederationInstance, 'Please call init first');
    // eslint-disable-next-line prefer-spread
    return FederationInstance.loadShareSync.apply(FederationInstance, args);
}
function preloadRemote(...args) {
    share.assert(FederationInstance, 'Please call init first');
    // eslint-disable-next-line prefer-spread
    return FederationInstance.preloadRemote.apply(FederationInstance, args);
}
// Inject for debug
share.setGlobalFederationConstructor(FederationHost);
exports.registerGlobalPlugins = share.registerGlobalPlugins;
Object.defineProperty(exports, "loadScript", ({
    enumerable: true,
    get: function() {
        return sdk.loadScript;
    }
}));
exports.FederationHost = FederationHost;
exports.init = init;
exports.loadRemote = loadRemote;
exports.loadShare = loadShare;
exports.loadShareSync = loadShareSync;
exports.preloadRemote = preloadRemote;
}),
"566": (function (__unused_webpack_module, exports) {
'use strict';
function getBuilderId() {
    //@ts-ignore
    return typeof FEDERATION_BUILD_IDENTIFIER !== 'undefined' ? FEDERATION_BUILD_IDENTIFIER : '';
}
function isDebugMode() {
    return Boolean("");
}
function isBrowserEnv() {
    return typeof window !== 'undefined';
}
const LOG_CATEGORY = '[ Federation Runtime ]';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function assert(condition, msg) {
    if (!condition) error(msg);
}
function error(msg) {
    throw new Error(`${LOG_CATEGORY}: ${msg}`);
}
function warn(msg) {
    console.warn(`${LOG_CATEGORY}: ${msg}`);
}
function addUniqueItem(arr, item) {
    if (arr.findIndex((name)=>name === item) === -1) arr.push(item);
    return arr;
}
function getFMId(remoteInfo) {
    if ('version' in remoteInfo && remoteInfo.version) return `${remoteInfo.name}:${remoteInfo.version}`;
    else if ('entry' in remoteInfo && remoteInfo.entry) return `${remoteInfo.name}:${remoteInfo.entry}`;
    else return `${remoteInfo.name}`;
}
function isRemoteInfoWithEntry(remote) {
    return typeof remote.entry !== 'undefined';
}
function isPureRemoteEntry(remote) {
    return !remote.entry.includes('.json') && remote.entry.includes('.js');
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function safeToString(info) {
    try {
        return JSON.stringify(info, null, 2);
    } catch (e) {
        return '';
    }
}
function isObject(val) {
    return val && typeof val === 'object';
}
const objectToString = Object.prototype.toString;
// eslint-disable-next-line @typescript-eslint/ban-types
function isPlainObject(val) {
    return objectToString.call(val) === '[object Object]';
}
function _extends$1() {
    _extends$1 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends$1.apply(this, arguments);
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
// export const nativeGlobal: typeof global = new Function('return this')();
const nativeGlobal = new Function('return this')();
const Global = nativeGlobal;
function definePropertyGlobalVal(target, key, val) {
    Object.defineProperty(target, key, {
        value: val,
        configurable: false,
        writable: true
    });
}
function includeOwnProperty(target, key) {
    return Object.hasOwnProperty.call(target, key);
}
// This section is to prevent encapsulation by certain microfrontend frameworks. Due to reuse policies, sandbox escapes.
// The sandbox in the microfrontend does not replicate the value of 'configurable'.
// If there is no loading content on the global object, this section defines the loading object.
if (!includeOwnProperty(globalThis, '__GLOBAL_LOADING_REMOTE_ENTRY__')) definePropertyGlobalVal(globalThis, '__GLOBAL_LOADING_REMOTE_ENTRY__', {});
const globalLoading = globalThis.__GLOBAL_LOADING_REMOTE_ENTRY__;
function setGlobalDefaultVal(target) {
    var _target___FEDERATION__, _target___FEDERATION__1, _target___FEDERATION__2, _target___FEDERATION__3, _target___FEDERATION__4, _target___FEDERATION__5;
    if (includeOwnProperty(target, '__VMOK__') && !includeOwnProperty(target, '__FEDERATION__')) definePropertyGlobalVal(target, '__FEDERATION__', target.__VMOK__);
    if (!includeOwnProperty(target, '__FEDERATION__')) {
        definePropertyGlobalVal(target, '__FEDERATION__', {
            __GLOBAL_PLUGIN__: [],
            __INSTANCES__: [],
            moduleInfo: {},
            __SHARE__: {},
            __MANIFEST_LOADING__: {},
            __PRELOADED_MAP__: new Map()
        });
        definePropertyGlobalVal(target, '__VMOK__', target.__FEDERATION__);
    }
    var ___GLOBAL_PLUGIN__;
    (___GLOBAL_PLUGIN__ = (_target___FEDERATION__ = target.__FEDERATION__).__GLOBAL_PLUGIN__) != null ? ___GLOBAL_PLUGIN__ : _target___FEDERATION__.__GLOBAL_PLUGIN__ = [];
    var ___INSTANCES__;
    (___INSTANCES__ = (_target___FEDERATION__1 = target.__FEDERATION__).__INSTANCES__) != null ? ___INSTANCES__ : _target___FEDERATION__1.__INSTANCES__ = [];
    var _moduleInfo;
    (_moduleInfo = (_target___FEDERATION__2 = target.__FEDERATION__).moduleInfo) != null ? _moduleInfo : _target___FEDERATION__2.moduleInfo = {};
    var ___SHARE__;
    (___SHARE__ = (_target___FEDERATION__3 = target.__FEDERATION__).__SHARE__) != null ? ___SHARE__ : _target___FEDERATION__3.__SHARE__ = {};
    var ___MANIFEST_LOADING__;
    (___MANIFEST_LOADING__ = (_target___FEDERATION__4 = target.__FEDERATION__).__MANIFEST_LOADING__) != null ? ___MANIFEST_LOADING__ : _target___FEDERATION__4.__MANIFEST_LOADING__ = {};
    var ___PRELOADED_MAP__;
    (___PRELOADED_MAP__ = (_target___FEDERATION__5 = target.__FEDERATION__).__PRELOADED_MAP__) != null ? ___PRELOADED_MAP__ : _target___FEDERATION__5.__PRELOADED_MAP__ = new Map();
}
setGlobalDefaultVal(globalThis);
setGlobalDefaultVal(nativeGlobal);
function resetFederationGlobalInfo() {
    globalThis.__FEDERATION__.__GLOBAL_PLUGIN__ = [];
    globalThis.__FEDERATION__.__INSTANCES__ = [];
    globalThis.__FEDERATION__.moduleInfo = {};
    globalThis.__FEDERATION__.__SHARE__ = {};
    globalThis.__FEDERATION__.__MANIFEST_LOADING__ = {};
}
function getGlobalFederationInstance(name, version) {
    const buildId = getBuilderId();
    return globalThis.__FEDERATION__.__INSTANCES__.find((GMInstance)=>{
        if (buildId && GMInstance.options.id === getBuilderId()) return true;
        if (GMInstance.options.name === name && !GMInstance.options.version && !version) return true;
        if (GMInstance.options.name === name && version && GMInstance.options.version === version) return true;
        return false;
    });
}
function setGlobalFederationInstance(FederationInstance) {
    globalThis.__FEDERATION__.__INSTANCES__.push(FederationInstance);
}
function getGlobalFederationConstructor() {
    return globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__;
}
function setGlobalFederationConstructor(FederationConstructor) {
    if (isDebugMode()) {
        globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = FederationConstructor;
        globalThis.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "0.0.8";
    }
}
// eslint-disable-next-line @typescript-eslint/ban-types
function getInfoWithoutType(target, key, getModuleInfoHook) {
    let res = {
        value: target[key],
        key: key
    };
    if (getModuleInfoHook) {
        const hookRes = getModuleInfoHook(target, key);
        res = hookRes || res;
    }
    return res;
}
const getGlobalSnapshot = ()=>nativeGlobal.__FEDERATION__.moduleInfo;
const getTargetSnapshotInfoByModuleInfo = (moduleInfo, snapshot, getModuleInfoHook)=>{
    // Check if the remote is included in the hostSnapshot
    const moduleKey = getFMId(moduleInfo);
    const getModuleInfo = getInfoWithoutType(snapshot, moduleKey, getModuleInfoHook).value;
    // The remoteSnapshot might not include a version
    if (getModuleInfo && !getModuleInfo.version && 'version' in moduleInfo && moduleInfo['version']) getModuleInfo.version = moduleInfo['version'];
    if (getModuleInfo) return getModuleInfo;
    // If the remote is not included in the hostSnapshot, deploy a micro app snapshot
    if ('version' in moduleInfo && moduleInfo['version']) {
        const { version } = moduleInfo, resModuleInfo = _object_without_properties_loose(moduleInfo, [
            "version"
        ]);
        const moduleKeyWithoutVersion = getFMId(resModuleInfo);
        const getModuleInfoWithoutVersion = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, moduleKeyWithoutVersion, getModuleInfoHook).value;
        if ((getModuleInfoWithoutVersion == null ? void 0 : getModuleInfoWithoutVersion.version) === version) return getModuleInfoWithoutVersion;
    }
    return;
};
const getGlobalSnapshotInfoByModuleInfo = (moduleInfo, extraOptions)=>getTargetSnapshotInfoByModuleInfo(moduleInfo, nativeGlobal.__FEDERATION__.moduleInfo, extraOptions == null ? void 0 : extraOptions.getModuleInfoHook);
const setGlobalSnapshotInfoByModuleInfo = (remoteInfo, moduleDetailInfo)=>{
    const moduleKey = getFMId(remoteInfo);
    nativeGlobal.__FEDERATION__.moduleInfo[moduleKey] = moduleDetailInfo;
    return nativeGlobal.__FEDERATION__.moduleInfo;
};
const addGlobalSnapshot = (moduleInfos)=>{
    nativeGlobal.__FEDERATION__.moduleInfo = _extends$1({}, nativeGlobal.__FEDERATION__.moduleInfo, moduleInfos);
    return ()=>{
        const keys = Object.keys(moduleInfos);
        for (const key of keys)delete nativeGlobal.__FEDERATION__.moduleInfo[key];
    };
};
const getRemoteEntryExports = (name, globalName)=>{
    const remoteEntryKey = globalName || `__FEDERATION_${name}:custom__`;
    const entryExports = globalThis[remoteEntryKey];
    return {
        remoteEntryKey,
        entryExports
    };
};
// This function is used to register global plugins.
// It iterates over the provided plugins and checks if they are already registered.
// If a plugin is not registered, it is added to the global plugins.
// If a plugin is already registered, a warning message is logged.
const registerGlobalPlugins = (plugins)=>{
    const { __GLOBAL_PLUGIN__ } = nativeGlobal.__FEDERATION__;
    plugins.forEach((plugin)=>{
        if (__GLOBAL_PLUGIN__.findIndex((p)=>p.name === plugin.name) === -1) __GLOBAL_PLUGIN__.push(plugin);
        else warn(`The plugin ${plugin.name} has been registered.`);
    });
};
const getGlobalHostPlugins = ()=>nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__;
const getPreloaded = (id)=>globalThis.__FEDERATION__.__PRELOADED_MAP__.get(id);
const setPreloaded = (id)=>globalThis.__FEDERATION__.__PRELOADED_MAP__.set(id, true);
const DEFAULT_SCOPE = 'default';
const DEFAULT_REMOTE_TYPE = 'global';
// those constants are based on https://www.rubydoc.info/gems/semantic_range/3.0.0/SemanticRange#BUILDIDENTIFIER-constant
const buildIdentifier = '[0-9A-Za-z-]+';
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = '0|[1-9]\\d*';
const numericIdentifierLoose = '[0-9]+';
const nonNumericIdentifier = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const mainVersionLoose = `(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`;
const loosePlain = `[v=\\s]*${mainVersionLoose}${preReleaseLoose}?${build}?`;
const gtlt = '((?:<|>)?=?)';
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = '(?:~>?)';
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = '(?:\\^)';
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = '(<|>)?=?\\s*\\*';
const caret = `^${loneCaret}${xRangePlain}$`;
const mainVersion = `(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`;
const fullPlain = `v?${mainVersion}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
// copy from semver package
const gte0 = '^\\s*>=\\s*0.0.0\\s*$';
function parseRegex(source) {
    return new RegExp(source);
}
function isXVersion(version) {
    return !version || version.toLowerCase() === 'x' || version === '*';
}
function pipe(...fns) {
    return (x)=>fns.reduce((v, f)=>f(v), x);
}
function extractComparator(comparatorString) {
    return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease) {
    const mainVersion = `${major}.${minor}.${patch}`;
    if (preRelease) return `${mainVersion}-${preRelease}`;
    return mainVersion;
}
function parseHyphen(range) {
    return range.replace(parseRegex(hyphenRange), (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease)=>{
        if (isXVersion(fromMajor)) from = '';
        else if (isXVersion(fromMinor)) from = `>=${fromMajor}.0.0`;
        else if (isXVersion(fromPatch)) from = `>=${fromMajor}.${fromMinor}.0`;
        else from = `>=${from}`;
        if (isXVersion(toMajor)) to = '';
        else if (isXVersion(toMinor)) to = `<${Number(toMajor) + 1}.0.0-0`;
        else if (isXVersion(toPatch)) to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
        else if (toPreRelease) to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
        else to = `<=${to}`;
        return `${from} ${to}`.trim();
    });
}
function parseComparatorTrim(range) {
    return range.replace(parseRegex(comparatorTrim), '$1$2$3');
}
function parseTildeTrim(range) {
    return range.replace(parseRegex(tildeTrim), '$1~');
}
function parseCaretTrim(range) {
    return range.replace(parseRegex(caretTrim), '$1^');
}
function parseCarets(range) {
    return range.trim().split(/\s+/).map((rangeVersion)=>rangeVersion.replace(parseRegex(caret), (_, major, minor, patch, preRelease)=>{
            if (isXVersion(major)) return '';
            else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
            else if (isXVersion(patch)) {
                if (major === '0') return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
                else return `>=${major}.${minor}.0 <${Number(major) + 1}.0.0-0`;
            } else if (preRelease) {
                if (major === '0') {
                    if (minor === '0') return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${minor}.${Number(patch) + 1}-0`;
                    else return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
                } else return `>=${major}.${minor}.${patch}-${preRelease} <${Number(major) + 1}.0.0-0`;
            } else {
                if (major === '0') {
                    if (minor === '0') return `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0`;
                    else return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
                }
                return `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
            }
        })).join(' ');
}
function parseTildes(range) {
    return range.trim().split(/\s+/).map((rangeVersion)=>rangeVersion.replace(parseRegex(tilde), (_, major, minor, patch, preRelease)=>{
            if (isXVersion(major)) return '';
            else if (isXVersion(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
            else if (isXVersion(patch)) return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
            else if (preRelease) return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
            return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
        })).join(' ');
}
function parseXRanges(range) {
    return range.split(/\s+/).map((rangeVersion)=>rangeVersion.trim().replace(parseRegex(xRange), (ret, gtlt, major, minor, patch, preRelease)=>{
            const isXMajor = isXVersion(major);
            const isXMinor = isXMajor || isXVersion(minor);
            const isXPatch = isXMinor || isXVersion(patch);
            if (gtlt === '=' && isXPatch) gtlt = '';
            preRelease = '';
            if (isXMajor) {
                if (gtlt === '>' || gtlt === '<') // nothing is allowed
                return '<0.0.0-0';
                else // nothing is forbidden
                return '*';
            } else if (gtlt && isXPatch) {
                // replace X with 0
                if (isXMinor) minor = 0;
                patch = 0;
                if (gtlt === '>') {
                    // >1 => >=2.0.0
                    // >1.2 => >=1.3.0
                    gtlt = '>=';
                    if (isXMinor) {
                        major = Number(major) + 1;
                        minor = 0;
                        patch = 0;
                    } else {
                        minor = Number(minor) + 1;
                        patch = 0;
                    }
                } else if (gtlt === '<=') {
                    // <=0.7.x is actually <0.8.0, since any 0.7.x should pass
                    // Similarly, <=7.x is actually <8.0.0, etc.
                    gtlt = '<';
                    if (isXMinor) major = Number(major) + 1;
                    else minor = Number(minor) + 1;
                }
                if (gtlt === '<') preRelease = '-0';
                return `${gtlt + major}.${minor}.${patch}${preRelease}`;
            } else if (isXMinor) return `>=${major}.0.0${preRelease} <${Number(major) + 1}.0.0-0`;
            else if (isXPatch) return `>=${major}.${minor}.0${preRelease} <${major}.${Number(minor) + 1}.0-0`;
            return ret;
        })).join(' ');
}
function parseStar(range) {
    return range.trim().replace(parseRegex(star), '');
}
function parseGTE0(comparatorString) {
    return comparatorString.trim().replace(parseRegex(gte0), '');
}
function compareAtom(rangeAtom, versionAtom) {
    rangeAtom = Number(rangeAtom) || rangeAtom;
    versionAtom = Number(versionAtom) || versionAtom;
    if (rangeAtom > versionAtom) return 1;
    if (rangeAtom === versionAtom) return 0;
    return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
    const { preRelease: rangePreRelease } = rangeAtom;
    const { preRelease: versionPreRelease } = versionAtom;
    if (rangePreRelease === undefined && Boolean(versionPreRelease)) return 1;
    if (Boolean(rangePreRelease) && versionPreRelease === undefined) return -1;
    if (rangePreRelease === undefined && versionPreRelease === undefined) return 0;
    for(let i = 0, n = rangePreRelease.length; i <= n; i++){
        const rangeElement = rangePreRelease[i];
        const versionElement = versionPreRelease[i];
        if (rangeElement === versionElement) continue;
        if (rangeElement === undefined && versionElement === undefined) return 0;
        if (!rangeElement) return 1;
        if (!versionElement) return -1;
        return compareAtom(rangeElement, versionElement);
    }
    return 0;
}
function compareVersion(rangeAtom, versionAtom) {
    return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
    return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
    switch(rangeAtom.operator){
        case '':
        case '=':
            return eq(rangeAtom, versionAtom);
        case '>':
            return compareVersion(rangeAtom, versionAtom) < 0;
        case '>=':
            return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
        case '<':
            return compareVersion(rangeAtom, versionAtom) > 0;
        case '<=':
            return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
        case undefined:
            // mean * or x -> all versions
            return true;
        default:
            return false;
    }
}
// fork from https://github.com/originjs/vite-plugin-federation/blob/v1.1.12/packages/lib/src/utils/semver/index.ts
function parseComparatorString(range) {
    return pipe(// ^ --> * (any, kinda silly)
    // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
    // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
    // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
    // ^1.2.3 --> >=1.2.3 <2.0.0-0
    // ^1.2.0 --> >=1.2.0 <2.0.0-0
    parseCarets, // ~, ~> --> * (any, kinda silly)
    // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
    // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
    // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
    // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
    // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
    parseTildes, parseXRanges, parseStar)(range);
}
function parseRange(range) {
    return pipe(// `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    parseHyphen, // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    parseComparatorTrim, // `~ 1.2.3` => `~1.2.3`
    parseTildeTrim, // `^ 1.2.3` => `^1.2.3`
    parseCaretTrim)(range.trim()).split(/\s+/).join(' ');
}
function satisfy(version, range) {
    if (!version) return false;
    const parsedRange = parseRange(range);
    const parsedComparator = parsedRange.split(' ').map((rangeVersion)=>parseComparatorString(rangeVersion)).join(' ');
    const comparators = parsedComparator.split(/\s+/).map((comparator)=>parseGTE0(comparator));
    const extractedVersion = extractComparator(version);
    if (!extractedVersion) return false;
    const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] = extractedVersion;
    const versionAtom = {
        operator: versionOperator,
        version: combineVersion(versionMajor, versionMinor, versionPatch, versionPreRelease),
        major: versionMajor,
        minor: versionMinor,
        patch: versionPatch,
        preRelease: versionPreRelease == null ? void 0 : versionPreRelease.split('.')
    };
    for (const comparator of comparators){
        const extractedComparator = extractComparator(comparator);
        if (!extractedComparator) return false;
        const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] = extractedComparator;
        const rangeAtom = {
            operator: rangeOperator,
            version: combineVersion(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
            major: rangeMajor,
            minor: rangeMinor,
            patch: rangePatch,
            preRelease: rangePreRelease == null ? void 0 : rangePreRelease.split('.')
        };
        if (!compare(rangeAtom, versionAtom)) return false; // early return
    }
    return true;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function formatShare(shareArgs, from) {
    let get;
    if ('get' in shareArgs) // eslint-disable-next-line prefer-destructuring
    get = shareArgs.get;
    else // @ts-ignore ignore
    get = ()=>Promise.resolve(shareArgs.lib);
    return _extends({
        deps: [],
        useIn: [],
        from,
        loading: null
    }, shareArgs, {
        shareConfig: _extends({
            requiredVersion: `^${shareArgs.version}`,
            singleton: false,
            eager: false,
            strictVersion: false
        }, shareArgs.shareConfig),
        get,
        loaded: 'lib' in shareArgs ? true : undefined,
        scope: Array.isArray(shareArgs.scope) ? shareArgs.scope : [
            'default'
        ],
        strategy: shareArgs.strategy || 'version-first'
    });
}
function formatShareConfigs(shareArgs, from) {
    if (!shareArgs) return {};
    return Object.keys(shareArgs).reduce((res, pkgName)=>{
        res[pkgName] = formatShare(shareArgs[pkgName], from);
        return res;
    }, {});
}
function versionLt(a, b) {
    const transformInvalidVersion = (version)=>{
        const isNumberVersion = !Number.isNaN(Number(version));
        if (isNumberVersion) {
            const splitArr = version.split('.');
            let validVersion = version;
            for(let i = 0; i < 3 - splitArr.length; i++)validVersion += '.0';
            return validVersion;
        }
        return version;
    };
    if (satisfy(transformInvalidVersion(a), `<=${transformInvalidVersion(b)}`)) return true;
    else return false;
}
const findVersion = (shareScopeMap, scope, pkgName, cb)=>{
    const versions = shareScopeMap[scope][pkgName];
    const callback = cb || function(prev, cur) {
        return versionLt(prev, cur);
    };
    return Object.keys(versions).reduce((prev, cur)=>{
        if (!prev) return cur;
        if (callback(prev, cur)) return cur;
        // default version is '0' https://github.com/webpack/webpack/blob/main/lib/sharing/ProvideSharedModule.js#L136
        if (prev === '0') return cur;
        return prev;
    }, 0);
};
function findSingletonVersionOrderByVersion(shareScopeMap, scope, pkgName) {
    const versions = shareScopeMap[scope][pkgName];
    const callback = function(prev, cur) {
        return !versions[prev].loaded && versionLt(prev, cur);
    };
    return findVersion(shareScopeMap, scope, pkgName, callback);
}
function findSingletonVersionOrderByLoaded(shareScopeMap, scope, pkgName) {
    const versions = shareScopeMap[scope][pkgName];
    const callback = function(prev, cur) {
        if (versions[cur].loaded) {
            if (versions[prev].loaded) return Boolean(versionLt(prev, cur));
            else return true;
        }
        if (versions[prev].loaded) return false;
        return versionLt(prev, cur);
    };
    return findVersion(shareScopeMap, scope, pkgName, callback);
}
function getFindShareFunction(strategy) {
    if (strategy === 'loaded-first') return findSingletonVersionOrderByLoaded;
    return findSingletonVersionOrderByVersion;
}
function getRegisteredShare(localShareScopeMap, pkgName, shareInfo, resolveShare) {
    if (!localShareScopeMap) return;
    const { shareConfig, scope = DEFAULT_SCOPE, strategy } = shareInfo;
    const scopes = Array.isArray(scope) ? scope : [
        scope
    ];
    for (const sc of scopes)if (shareConfig && localShareScopeMap[sc] && localShareScopeMap[sc][pkgName]) {
        const { requiredVersion } = shareConfig;
        const findShareFunction = getFindShareFunction(strategy);
        const maxOrSingletonVersion = findShareFunction(localShareScopeMap, sc, pkgName);
        //@ts-ignore
        const defaultResolver = ()=>{
            if (shareConfig.singleton) {
                if (typeof requiredVersion === 'string' && !satisfy(maxOrSingletonVersion, requiredVersion)) {
                    const msg = `Version ${maxOrSingletonVersion} from ${maxOrSingletonVersion && localShareScopeMap[sc][pkgName][maxOrSingletonVersion].from} of shared singleton module ${pkgName} does not satisfy the requirement of ${shareInfo.from} which needs ${requiredVersion})`;
                    if (shareConfig.strictVersion) error(msg);
                    else warn(msg);
                }
                return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
            } else {
                if (requiredVersion === false || requiredVersion === '*') return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
                if (satisfy(maxOrSingletonVersion, requiredVersion)) return localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
                for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])){
                    if (satisfy(versionKey, requiredVersion)) return versionValue;
                }
            }
        };
        const params = {
            shareScopeMap: localShareScopeMap,
            scope: sc,
            pkgName,
            version: maxOrSingletonVersion,
            GlobalFederation: Global.__FEDERATION__,
            resolver: defaultResolver
        };
        const resolveShared = resolveShare.emit(params) || params;
        return resolveShared.resolver();
    }
}
function getGlobalShareScope() {
    return Global.__FEDERATION__.__SHARE__;
}
exports.DEFAULT_REMOTE_TYPE = DEFAULT_REMOTE_TYPE;
exports.DEFAULT_SCOPE = DEFAULT_SCOPE;
exports.Global = Global;
exports.addGlobalSnapshot = addGlobalSnapshot;
exports.addUniqueItem = addUniqueItem;
exports.assert = assert;
exports.error = error;
exports.formatShareConfigs = formatShareConfigs;
exports.getBuilderId = getBuilderId;
exports.getFMId = getFMId;
exports.getGlobalFederationConstructor = getGlobalFederationConstructor;
exports.getGlobalFederationInstance = getGlobalFederationInstance;
exports.getGlobalHostPlugins = getGlobalHostPlugins;
exports.getGlobalShareScope = getGlobalShareScope;
exports.getGlobalSnapshot = getGlobalSnapshot;
exports.getGlobalSnapshotInfoByModuleInfo = getGlobalSnapshotInfoByModuleInfo;
exports.getInfoWithoutType = getInfoWithoutType;
exports.getPreloaded = getPreloaded;
exports.getRegisteredShare = getRegisteredShare;
exports.getRemoteEntryExports = getRemoteEntryExports;
exports.getTargetSnapshotInfoByModuleInfo = getTargetSnapshotInfoByModuleInfo;
exports.globalLoading = globalLoading;
exports.isBrowserEnv = isBrowserEnv;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isPureRemoteEntry = isPureRemoteEntry;
exports.isRemoteInfoWithEntry = isRemoteInfoWithEntry;
exports.nativeGlobal = nativeGlobal;
exports.registerGlobalPlugins = registerGlobalPlugins;
exports.resetFederationGlobalInfo = resetFederationGlobalInfo;
exports.safeToString = safeToString;
exports.setGlobalFederationConstructor = setGlobalFederationConstructor;
exports.setGlobalFederationInstance = setGlobalFederationInstance;
exports.setGlobalSnapshotInfoByModuleInfo = setGlobalSnapshotInfoByModuleInfo;
exports.setPreloaded = setPreloaded;
exports.warn = warn;
}),
"70": (function (__unused_webpack_module, exports) {
'use strict';
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
function _define_property$2(obj1, key1, value1) {
    if (key1 in obj1) Object.defineProperty(obj1, key1, {
        value: value1,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj1[key1] = value1;
    return obj1;
}
var FederationModuleManifest = "federation-manifest.json";
var MANIFEST_EXT = ".json";
var BROWSER_LOG_KEY = "FEDERATION_DEBUG";
var BROWSER_LOG_VALUE = "1";
var NameTransformSymbol = {
    AT: "@",
    HYPHEN: "-",
    SLASH: "/"
};
var _obj;
var NameTransformMap = (_obj = {}, _define_property$2(_obj, NameTransformSymbol.AT, "scope_"), _define_property$2(_obj, NameTransformSymbol.HYPHEN, "_"), _define_property$2(_obj, NameTransformSymbol.SLASH, "__"), _obj);
var _obj1;
var EncodedNameTransformMap = (_obj1 = {}, _define_property$2(_obj1, NameTransformMap[NameTransformSymbol.AT], NameTransformSymbol.AT), _define_property$2(_obj1, NameTransformMap[NameTransformSymbol.HYPHEN], NameTransformSymbol.HYPHEN), _define_property$2(_obj1, NameTransformMap[NameTransformSymbol.SLASH], NameTransformSymbol.SLASH), _obj1);
var SEPARATOR = ":";
function isBrowserEnv() {
    return typeof window !== "undefined";
}
function isDebugMode() {
    if (typeof process !== "undefined" && process.env && process.env["FEDERATION_DEBUG"]) return Boolean(process.env["FEDERATION_DEBUG"]);
    return typeof FEDERATION_DEBUG !== "undefined" && Boolean(FEDERATION_DEBUG);
}
var getProcessEnv = function getProcessEnv1() {
    return typeof process !== "undefined" && process.env ? process.env : {};
};
function _array_like_to_array$2(arr1, len1) {
    if (len1 == null || len1 > arr1.length) len1 = arr1.length;
    for(var i1 = 0, arr21 = new Array(len1); i1 < len1; i1++)arr21[i1] = arr1[i1];
    return arr21;
}
function _array_without_holes(arr1) {
    if (Array.isArray(arr1)) return _array_like_to_array$2(arr1);
}
function _class_call_check(instance1, Constructor1) {
    if (!(instance1 instanceof Constructor1)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target1, props1) {
    for(var i1 = 0; i1 < props1.length; i1++){
        var descriptor1 = props1[i1];
        descriptor1.enumerable = descriptor1.enumerable || false;
        descriptor1.configurable = true;
        if ("value" in descriptor1) descriptor1.writable = true;
        Object.defineProperty(target1, descriptor1.key, descriptor1);
    }
}
function _create_class(Constructor1, protoProps1, staticProps1) {
    if (protoProps1) _defineProperties(Constructor1.prototype, protoProps1);
    if (staticProps1) _defineProperties(Constructor1, staticProps1);
    return Constructor1;
}
function _define_property$1(obj1, key1, value1) {
    if (key1 in obj1) Object.defineProperty(obj1, key1, {
        value: value1,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj1[key1] = value1;
    return obj1;
}
function _iterable_to_array$1(iter1) {
    if (typeof Symbol !== "undefined" && iter1[Symbol.iterator] != null || iter1["@@iterator"] != null) return Array.from(iter1);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr1) {
    return _array_without_holes(arr1) || _iterable_to_array$1(arr1) || _unsupported_iterable_to_array$2(arr1) || _non_iterable_spread();
}
function _unsupported_iterable_to_array$2(o1, minLen1) {
    if (!o1) return;
    if (typeof o1 === "string") return _array_like_to_array$2(o1, minLen1);
    var n1 = Object.prototype.toString.call(o1).slice(8, -1);
    if (n1 === "Object" && o1.constructor) n1 = o1.constructor.name;
    if (n1 === "Map" || n1 === "Set") return Array.from(n1);
    if (n1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n1)) return _array_like_to_array$2(o1, minLen1);
}
function safeToString(info1) {
    try {
        return JSON.stringify(info1, null, 2);
    } catch (e1) {
        return "";
    }
}
var DEBUG_LOG = "[ FEDERATION DEBUG ]";
var Logger = /*#__PURE__*/ function() {
    function Logger1(identifier1) {
        _class_call_check(this, Logger1);
        _define_property$1(this, "enable", false);
        _define_property$1(this, "identifier", void 0);
        this.identifier = identifier1 || DEBUG_LOG;
        if (isBrowserEnv() && localStorage.getItem(BROWSER_LOG_KEY) === BROWSER_LOG_VALUE) this.enable = true;
        else if (isDebugMode()) this.enable = true;
    }
    _create_class(Logger1, [
        {
            key: "info",
            value: function info1(msg1, info1) {
                if (this.enable) {
                    var argsToString1 = safeToString(info1) || "";
                    if (isBrowserEnv()) console.info("%c ".concat(this.identifier, ": ").concat(msg1, " ").concat(argsToString1), "color:#3300CC");
                    else console.info("\x1b[34m%s", "".concat(this.identifier, ": ").concat(msg1, " ").concat(argsToString1 ? "\n".concat(argsToString1) : ""));
                }
            }
        },
        {
            key: "logOriginalInfo",
            value: function logOriginalInfo1() {
                for(var _len1 = arguments.length, args1 = new Array(_len1), _key1 = 0; _key1 < _len1; _key1++)args1[_key1] = arguments[_key1];
                if (this.enable) {
                    if (isBrowserEnv()) {
                        var _console2;
                        console.info("%c ".concat(this.identifier, ": OriginalInfo"), "color:#3300CC");
                        (_console2 = console).log.apply(_console2, _to_consumable_array(args1));
                    } else {
                        var _console11;
                        console.info("%c ".concat(this.identifier, ": OriginalInfo"), "color:#3300CC");
                        (_console11 = console).log.apply(_console11, _to_consumable_array(args1));
                    }
                }
            }
        }
    ]);
    return Logger1;
}();
function _array_like_to_array$1(arr1, len1) {
    if (len1 == null || len1 > arr1.length) len1 = arr1.length;
    for(var i1 = 0, arr21 = new Array(len1); i1 < len1; i1++)arr21[i1] = arr1[i1];
    return arr21;
}
function _array_with_holes$1(arr1) {
    if (Array.isArray(arr1)) return arr1;
}
function _iterable_to_array(iter1) {
    if (typeof Symbol !== "undefined" && iter1[Symbol.iterator] != null || iter1["@@iterator"] != null) return Array.from(iter1);
}
function _iterable_to_array_limit$1(arr1, i1) {
    var _i1 = arr1 == null ? null : typeof Symbol !== "undefined" && arr1[Symbol.iterator] || arr1["@@iterator"];
    if (_i1 == null) return;
    var _arr1 = [];
    var _n1 = true;
    var _d1 = false;
    var _s1, _e1;
    try {
        for(_i1 = _i1.call(arr1); !(_n1 = (_s1 = _i1.next()).done); _n1 = true){
            _arr1.push(_s1.value);
            if (i1 && _arr1.length === i1) break;
        }
    } catch (err1) {
        _d1 = true;
        _e1 = err1;
    } finally{
        try {
            if (!_n1 && _i1["return"] != null) _i1["return"]();
        } finally{
            if (_d1) throw _e1;
        }
    }
    return _arr1;
}
function _non_iterable_rest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array$1(arr1, i1) {
    return _array_with_holes$1(arr1) || _iterable_to_array_limit$1(arr1, i1) || _unsupported_iterable_to_array$1(arr1, i1) || _non_iterable_rest$1();
}
function _to_array(arr1) {
    return _array_with_holes$1(arr1) || _iterable_to_array(arr1) || _unsupported_iterable_to_array$1(arr1) || _non_iterable_rest$1();
}
function _unsupported_iterable_to_array$1(o1, minLen1) {
    if (!o1) return;
    if (typeof o1 === "string") return _array_like_to_array$1(o1, minLen1);
    var n1 = Object.prototype.toString.call(o1).slice(8, -1);
    if (n1 === "Object" && o1.constructor) n1 = o1.constructor.name;
    if (n1 === "Map" || n1 === "Set") return Array.from(n1);
    if (n1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n1)) return _array_like_to_array$1(o1, minLen1);
}
var LOG_CATEGORY = "[ Federation Runtime ]";
// entry: name:version   version : 1.0.0 | ^1.2.3
// entry: name:entry  entry:  https://localhost:9000/federation-manifest.json
var parseEntry = function(str1, devVerOrUrl1) {
    var strSplit1 = str1.split(SEPARATOR);
    var devVersionOrUrl1 = getProcessEnv()["NODE_ENV"] === "development" && devVerOrUrl1;
    var defaultVersion1 = "*";
    var isEntry1 = function(s1) {
        return s1.startsWith("http") || s1.includes(MANIFEST_EXT);
    };
    // Check if the string starts with a type
    if (strSplit1.length >= 2) {
        var _strSplit2 = _to_array(strSplit1), name2 = _strSplit2[0], versionOrEntryArr1 = _strSplit2.slice(1);
        var versionOrEntry1 = devVersionOrUrl1 || versionOrEntryArr1.join(SEPARATOR);
        if (isEntry1(versionOrEntry1)) return {
            name: name2,
            entry: versionOrEntry1
        };
        else // Apply version rule
        // devVersionOrUrl => inputVersion => defaultVersion
        return {
            name: name2,
            version: versionOrEntry1 || defaultVersion1
        };
    } else if (strSplit1.length === 1) {
        var _strSplit11 = _sliced_to_array$1(strSplit1, 1), name11 = _strSplit11[0];
        if (devVersionOrUrl1 && isEntry1(devVersionOrUrl1)) return {
            name: name11,
            entry: devVersionOrUrl1
        };
        return {
            name: name11,
            version: devVersionOrUrl1 || defaultVersion1
        };
    } else throw "Invalid entry value: ".concat(str1);
};
var logger = new Logger();
var composeKeyWithSeparator = function composeKeyWithSeparator1() {
    for(var _len1 = arguments.length, args1 = new Array(_len1), _key1 = 0; _key1 < _len1; _key1++)args1[_key1] = arguments[_key1];
    if (!args1.length) return "";
    return args1.reduce(function(sum1, cur1) {
        if (!cur1) return sum1;
        if (!sum1) return cur1;
        return "".concat(sum1).concat(SEPARATOR).concat(cur1);
    }, "");
};
var encodeName = function encodeName1(name2) {
    var prefix1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", withExt1 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    try {
        var ext1 = withExt1 ? ".js" : "";
        return "".concat(prefix1).concat(name2.replace(new RegExp("".concat(NameTransformSymbol.AT), "g"), NameTransformMap[NameTransformSymbol.AT]).replace(new RegExp("".concat(NameTransformSymbol.HYPHEN), "g"), NameTransformMap[NameTransformSymbol.HYPHEN]).replace(new RegExp("".concat(NameTransformSymbol.SLASH), "g"), NameTransformMap[NameTransformSymbol.SLASH])).concat(ext1);
    } catch (err1) {
        throw err1;
    }
};
var decodeName = function decodeName1(name2, prefix1, withExt1) {
    try {
        var decodedName1 = name2;
        if (prefix1) {
            if (!decodedName1.startsWith(prefix1)) return decodedName1;
            decodedName1 = decodedName1.replace(new RegExp(prefix1, "g"), "");
        }
        decodedName1 = decodedName1.replace(new RegExp("".concat(NameTransformMap[NameTransformSymbol.AT]), "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.AT]]).replace(new RegExp("".concat(NameTransformMap[NameTransformSymbol.SLASH]), "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.SLASH]]).replace(new RegExp("".concat(NameTransformMap[NameTransformSymbol.HYPHEN]), "g"), EncodedNameTransformMap[NameTransformMap[NameTransformSymbol.HYPHEN]]);
        if (withExt1) decodedName1 = decodedName1.replace(".js", "");
        return decodedName1;
    } catch (err1) {
        throw err1;
    }
};
var generateExposeFilename = function(exposeName1, withExt1) {
    if (!exposeName1) return "";
    var expose1 = exposeName1;
    if (expose1 === ".") expose1 = "default_export";
    if (expose1.startsWith("./")) expose1 = expose1.replace("./", "");
    return encodeName(expose1, "__federation_expose_", withExt1);
};
var generateShareFilename = function(pkgName1, withExt1) {
    if (!pkgName1) return "";
    return encodeName(pkgName1, "__federation_shared_", withExt1);
};
var getResourceUrl = function(module1, sourceUrl1) {
    if ("getPublicPath" in module1) {
        var publicPath1 = new Function(module1.getPublicPath)();
        return "".concat(publicPath1).concat(sourceUrl1);
    } else if ("publicPath" in module1) return "".concat(module1.publicPath).concat(sourceUrl1);
    else {
        console.warn("Can not get resource url, if in debug mode, please ignore", module1, sourceUrl1);
        return "";
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var assert = function(condition1, msg1) {
    if (!condition1) error(msg1);
};
var error = function(msg1) {
    throw new Error("".concat(LOG_CATEGORY, ": ").concat(msg1));
};
var warn = function(msg1) {
    console.warn("".concat(LOG_CATEGORY, ": ").concat(msg1));
};
function _define_property(obj1, key1, value1) {
    if (key1 in obj1) Object.defineProperty(obj1, key1, {
        value: value1,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj1[key1] = value1;
    return obj1;
}
function _object_spread(target1) {
    for(var i1 = 1; i1 < arguments.length; i1++){
        var source1 = arguments[i1] != null ? arguments[i1] : {};
        var ownKeys1 = Object.keys(source1);
        if (typeof Object.getOwnPropertySymbols === "function") ownKeys1 = ownKeys1.concat(Object.getOwnPropertySymbols(source1).filter(function(sym1) {
            return Object.getOwnPropertyDescriptor(source1, sym1).enumerable;
        }));
        ownKeys1.forEach(function(key1) {
            _define_property(target1, key1, source1[key1]);
        });
    }
    return target1;
}
function ownKeys(object1, enumerableOnly1) {
    var keys1 = Object.keys(object1);
    if (Object.getOwnPropertySymbols) {
        var symbols1 = Object.getOwnPropertySymbols(object1);
        if (enumerableOnly1) symbols1 = symbols1.filter(function(sym1) {
            return Object.getOwnPropertyDescriptor(object1, sym1).enumerable;
        });
        keys1.push.apply(keys1, symbols1);
    }
    return keys1;
}
function _object_spread_props(target1, source1) {
    source1 = source1 != null ? source1 : {};
    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target1, Object.getOwnPropertyDescriptors(source1));
    else ownKeys(Object(source1)).forEach(function(key1) {
        Object.defineProperty(target1, key1, Object.getOwnPropertyDescriptor(source1, key1));
    });
    return target1;
}
var simpleJoinRemoteEntry = function(rPath1, rName1) {
    if (!rPath1) return rName1;
    var transformPath1 = function(str1) {
        if (str1 === ".") return "";
        if (str1.startsWith("./")) return str1.replace("./", "");
        if (str1.startsWith("/")) {
            var strWithoutSlash1 = str1.slice(1);
            if (strWithoutSlash1.endsWith("/")) return strWithoutSlash1.slice(0, -1);
            return strWithoutSlash1;
        }
        return str1;
    };
    var transformedPath1 = transformPath1(rPath1);
    if (!transformedPath1) return rName1;
    if (transformedPath1.endsWith("/")) return "".concat(transformedPath1).concat(rName1);
    return "".concat(transformedPath1, "/").concat(rName1);
};
// Priority: overrides > remotes
// eslint-disable-next-line max-lines-per-function
function generateSnapshotFromManifest(manifest1) {
    var options1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _manifest_metaData2;
    var _options_remotes1 = options1.remotes, remotes1 = _options_remotes1 === void 0 ? {} : _options_remotes1, _options_overrides1 = options1.overrides, overrides1 = _options_overrides1 === void 0 ? {} : _options_overrides1, version1 = options1.version;
    var remoteSnapshot1;
    var getPublicPath1 = function() {
        if ("publicPath" in manifest1.metaData) return manifest1.metaData.publicPath;
        else return manifest1.metaData.getPublicPath;
    };
    var overridesKeys1 = Object.keys(overrides1);
    var remotesInfo1 = {};
    // If remotes are not provided, only the remotes in the manifest will be read
    if (!Object.keys(remotes1).length) {
        var _manifest_remotes1;
        remotesInfo1 = ((_manifest_remotes1 = manifest1.remotes) === null || _manifest_remotes1 === void 0 ? void 0 : _manifest_remotes1.reduce(function(res1, next1) {
            var matchedVersion1;
            var name2 = next1.federationContainerName;
            // overrides have higher priority
            if (overridesKeys1.includes(name2)) matchedVersion1 = overrides1[name2];
            else if ("version" in next1) matchedVersion1 = next1.version;
            else matchedVersion1 = next1.entry;
            res1[name2] = {
                matchedVersion: matchedVersion1
            };
            return res1;
        }, {})) || {};
    }
    // If remotes (deploy scenario) are specified, they need to be traversed again
    Object.keys(remotes1).forEach(function(key1) {
        return remotesInfo1[key1] = {
            // overrides will override dependencies
            matchedVersion: overridesKeys1.includes(key1) ? overrides1[key1] : remotes1[key1]
        };
    });
    var _manifest_metaData11 = manifest1.metaData, _manifest_metaData_remoteEntry1 = _manifest_metaData11.remoteEntry, remoteEntryPath1 = _manifest_metaData_remoteEntry1.path, remoteEntryName1 = _manifest_metaData_remoteEntry1.name, remoteEntryType1 = _manifest_metaData_remoteEntry1.type, remoteTypes1 = _manifest_metaData11.types, buildVersion1 = _manifest_metaData11.buildInfo.buildVersion, globalName1 = _manifest_metaData11.globalName;
    var exposes1 = manifest1.exposes;
    var basicRemoteSnapshot1 = {
        version: version1 ? version1 : "",
        buildVersion: buildVersion1,
        globalName: globalName1,
        remoteEntry: simpleJoinRemoteEntry(remoteEntryPath1, remoteEntryName1),
        remoteEntryType: remoteEntryType1,
        remoteTypes: simpleJoinRemoteEntry(remoteTypes1.path, remoteTypes1.name),
        remotesInfo: remotesInfo1,
        shared: manifest1 === null || manifest1 === void 0 ? void 0 : manifest1.shared.map(function(item1) {
            return {
                assets: item1.assets,
                sharedName: item1.name
            };
        }),
        modules: exposes1 === null || exposes1 === void 0 ? void 0 : exposes1.map(function(expose1) {
            return {
                moduleName: expose1.name,
                modulePath: expose1.path,
                assets: expose1.assets
            };
        })
    };
    if ((_manifest_metaData2 = manifest1.metaData) === null || _manifest_metaData2 === void 0 ? void 0 : _manifest_metaData2.prefetchEntry) {
        var _manifest_metaData_prefetchEntry1 = manifest1.metaData.prefetchEntry, path1 = _manifest_metaData_prefetchEntry1.path, name2 = _manifest_metaData_prefetchEntry1.name, type1 = _manifest_metaData_prefetchEntry1.type;
        basicRemoteSnapshot1 = _object_spread_props(_object_spread({}, basicRemoteSnapshot1), {
            prefetchEntry: simpleJoinRemoteEntry(path1, name2),
            prefetchEntryType: type1
        });
    }
    if ("publicPath" in manifest1.metaData) remoteSnapshot1 = _object_spread_props(_object_spread({}, basicRemoteSnapshot1), {
        publicPath: getPublicPath1()
    });
    else remoteSnapshot1 = _object_spread_props(_object_spread({}, basicRemoteSnapshot1), {
        getPublicPath: getPublicPath1()
    });
    return remoteSnapshot1;
}
function isManifestProvider(moduleInfo1) {
    if ("remoteEntry" in moduleInfo1 && moduleInfo1.remoteEntry.includes(MANIFEST_EXT)) return true;
    else return false;
}
function asyncGeneratorStep$1(gen1, resolve1, reject1, _next1, _throw1, key1, arg1) {
    try {
        var info1 = gen1[key1](arg1);
        var value1 = info1.value;
    } catch (error1) {
        reject1(error1);
        return;
    }
    if (info1.done) resolve1(value1);
    else Promise.resolve(value1).then(_next1, _throw1);
}
function _async_to_generator$1(fn1) {
    return function() {
        var self1 = this, args1 = arguments;
        return new Promise(function(resolve1, reject1) {
            var gen1 = fn1.apply(self1, args1);
            function _next1(value1) {
                asyncGeneratorStep$1(gen1, resolve1, reject1, _next1, _throw1, "next", value1);
            }
            function _throw1(err1) {
                asyncGeneratorStep$1(gen1, resolve1, reject1, _next1, _throw1, "throw", err1);
            }
            _next1(undefined);
        });
    };
}
function _instanceof(left1, right1) {
    if (right1 != null && typeof Symbol !== "undefined" && right1[Symbol.hasInstance]) return !!right1[Symbol.hasInstance](left1);
    else return left1 instanceof right1;
}
function _ts_generator$1(thisArg1, body1) {
    var f1, y1, t1, g1, _1 = {
        label: 0,
        sent: function() {
            if (t1[0] & 1) throw t1[1];
            return t1[1];
        },
        trys: [],
        ops: []
    };
    return g1 = {
        next: verb1(0),
        "throw": verb1(1),
        "return": verb1(2)
    }, typeof Symbol === "function" && (g1[Symbol.iterator] = function() {
        return this;
    }), g1;
    function verb1(n1) {
        return function(v1) {
            return step1([
                n1,
                v1
            ]);
        };
    }
    function step1(op1) {
        if (f1) throw new TypeError("Generator is already executing.");
        while(_1)try {
            if (f1 = 1, y1 && (t1 = op1[0] & 2 ? y1["return"] : op1[0] ? y1["throw"] || ((t1 = y1["return"]) && t1.call(y1), 0) : y1.next) && !(t1 = t1.call(y1, op1[1])).done) return t1;
            if (y1 = 0, t1) op1 = [
                op1[0] & 2,
                t1.value
            ];
            switch(op1[0]){
                case 0:
                case 1:
                    t1 = op1;
                    break;
                case 4:
                    _1.label++;
                    return {
                        value: op1[1],
                        done: false
                    };
                case 5:
                    _1.label++;
                    y1 = op1[1];
                    op1 = [
                        0
                    ];
                    continue;
                case 7:
                    op1 = _1.ops.pop();
                    _1.trys.pop();
                    continue;
                default:
                    if (!(t1 = _1.trys, t1 = t1.length > 0 && t1[t1.length - 1]) && (op1[0] === 6 || op1[0] === 2)) {
                        _1 = 0;
                        continue;
                    }
                    if (op1[0] === 3 && (!t1 || op1[1] > t1[0] && op1[1] < t1[3])) {
                        _1.label = op1[1];
                        break;
                    }
                    if (op1[0] === 6 && _1.label < t1[1]) {
                        _1.label = t1[1];
                        t1 = op1;
                        break;
                    }
                    if (t1 && _1.label < t1[2]) {
                        _1.label = t1[2];
                        _1.ops.push(op1);
                        break;
                    }
                    if (t1[2]) _1.ops.pop();
                    _1.trys.pop();
                    continue;
            }
            op1 = body1.call(thisArg1, _1);
        } catch (e1) {
            op1 = [
                6,
                e1
            ];
            y1 = 0;
        } finally{
            f1 = t1 = 0;
        }
        if (op1[0] & 5) throw op1[1];
        return {
            value: op1[0] ? op1[1] : void 0,
            done: true
        };
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeWrapper(callback1, disableWarn1) {
    return _safeWrapper.apply(this, arguments);
}
function _safeWrapper() {
    _safeWrapper = _async_to_generator$1(function(callback1, disableWarn1) {
        var res1, e1;
        return _ts_generator$1(this, function(_state1) {
            switch(_state1.label){
                case 0:
                    _state1.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        callback1()
                    ];
                case 1:
                    res1 = _state1.sent();
                    return [
                        2,
                        res1
                    ];
                case 2:
                    e1 = _state1.sent();
                    !disableWarn1 && warn(e1);
                    return [
                        2
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return _safeWrapper.apply(this, arguments);
}
function isStaticResourcesEqual(url11, url21) {
    var REG_EXP1 = /^(https?:)?\/\//i;
    // Transform url1 and url2 into relative paths
    var relativeUrl11 = url11.replace(REG_EXP1, "").replace(/\/$/, "");
    var relativeUrl21 = url21.replace(REG_EXP1, "").replace(/\/$/, "");
    // Check if the relative paths are identical
    return relativeUrl11 === relativeUrl21;
}
function createScript(url3, cb1, attrs1, createScriptHook1) {
    // Retrieve the existing script element by its src attribute
    var script1 = null;
    var needAttach1 = true;
    var scripts1 = document.getElementsByTagName("script");
    for(var i1 = 0; i1 < scripts1.length; i1++){
        var s1 = scripts1[i1];
        var scriptSrc1 = s1.getAttribute("src");
        if (scriptSrc1 && isStaticResourcesEqual(scriptSrc1, url3)) {
            script1 = s1;
            needAttach1 = false;
            break;
        }
    }
    if (!script1) {
        script1 = document.createElement("script");
        script1.type = "text/javascript";
        script1.src = url3;
        if (createScriptHook1) {
            var createScriptRes1 = createScriptHook1(url3);
            if (_instanceof(createScriptRes1, HTMLScriptElement)) script1 = createScriptRes1;
        }
    }
    if (attrs1) Object.keys(attrs1).forEach(function(name2) {
        if (script1) {
            if (name2 === "async" || name2 === "defer") script1[name2] = attrs1[name2];
            else script1.setAttribute(name2, attrs1[name2]);
        }
    });
    var onScriptComplete1 = function(prev1, event1) {
        // Prevent memory leaks in IE.
        if (script1) {
            script1.onerror = null;
            script1.onload = null;
            safeWrapper(function() {
                (script1 === null || script1 === void 0 ? void 0 : script1.parentNode) && script1.parentNode.removeChild(script1);
            });
            if (prev1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var res1 = prev1(event1);
                cb1();
                return res1;
            }
        }
        cb1();
    };
    script1.onerror = onScriptComplete1.bind(null, script1.onerror);
    script1.onload = onScriptComplete1.bind(null, script1.onload);
    return {
        script: script1,
        needAttach: needAttach1
    };
}
function loadScript(url3, info1) {
    var attrs1 = info1.attrs, createScriptHook1 = info1.createScriptHook;
    return new Promise(function(resolve1, _reject1) {
        var _createScript1 = createScript(url3, resolve1, attrs1, createScriptHook1), script1 = _createScript1.script, needAttach1 = _createScript1.needAttach;
        needAttach1 && document.getElementsByTagName("head")[0].appendChild(script1);
    });
}
function _array_like_to_array(arr1, len1) {
    if (len1 == null || len1 > arr1.length) len1 = arr1.length;
    for(var i1 = 0, arr21 = new Array(len1); i1 < len1; i1++)arr21[i1] = arr1[i1];
    return arr21;
}
function _array_with_holes(arr1) {
    if (Array.isArray(arr1)) return arr1;
}
function asyncGeneratorStep(gen1, resolve1, reject1, _next1, _throw1, key1, arg1) {
    try {
        var info1 = gen1[key1](arg1);
        var value1 = info1.value;
    } catch (error1) {
        reject1(error1);
        return;
    }
    if (info1.done) resolve1(value1);
    else Promise.resolve(value1).then(_next1, _throw1);
}
function _async_to_generator(fn1) {
    return function() {
        var self1 = this, args1 = arguments;
        return new Promise(function(resolve1, reject1) {
            var gen1 = fn1.apply(self1, args1);
            function _next1(value1) {
                asyncGeneratorStep(gen1, resolve1, reject1, _next1, _throw1, "next", value1);
            }
            function _throw1(err1) {
                asyncGeneratorStep(gen1, resolve1, reject1, _next1, _throw1, "throw", err1);
            }
            _next1(undefined);
        });
    };
}
function _iterable_to_array_limit(arr1, i1) {
    var _i1 = arr1 == null ? null : typeof Symbol !== "undefined" && arr1[Symbol.iterator] || arr1["@@iterator"];
    if (_i1 == null) return;
    var _arr1 = [];
    var _n1 = true;
    var _d1 = false;
    var _s1, _e1;
    try {
        for(_i1 = _i1.call(arr1); !(_n1 = (_s1 = _i1.next()).done); _n1 = true){
            _arr1.push(_s1.value);
            if (i1 && _arr1.length === i1) break;
        }
    } catch (err1) {
        _d1 = true;
        _e1 = err1;
    } finally{
        try {
            if (!_n1 && _i1["return"] != null) _i1["return"]();
        } finally{
            if (_d1) throw _e1;
        }
    }
    return _arr1;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr1, i1) {
    return _array_with_holes(arr1) || _iterable_to_array_limit(arr1, i1) || _unsupported_iterable_to_array(arr1, i1) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o1, minLen1) {
    if (!o1) return;
    if (typeof o1 === "string") return _array_like_to_array(o1, minLen1);
    var n1 = Object.prototype.toString.call(o1).slice(8, -1);
    if (n1 === "Object" && o1.constructor) n1 = o1.constructor.name;
    if (n1 === "Map" || n1 === "Set") return Array.from(n1);
    if (n1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n1)) return _array_like_to_array(o1, minLen1);
}
function _ts_generator(thisArg1, body1) {
    var f1, y1, t1, g1, _1 = {
        label: 0,
        sent: function() {
            if (t1[0] & 1) throw t1[1];
            return t1[1];
        },
        trys: [],
        ops: []
    };
    return g1 = {
        next: verb1(0),
        "throw": verb1(1),
        "return": verb1(2)
    }, typeof Symbol === "function" && (g1[Symbol.iterator] = function() {
        return this;
    }), g1;
    function verb1(n1) {
        return function(v1) {
            return step1([
                n1,
                v1
            ]);
        };
    }
    function step1(op1) {
        if (f1) throw new TypeError("Generator is already executing.");
        while(_1)try {
            if (f1 = 1, y1 && (t1 = op1[0] & 2 ? y1["return"] : op1[0] ? y1["throw"] || ((t1 = y1["return"]) && t1.call(y1), 0) : y1.next) && !(t1 = t1.call(y1, op1[1])).done) return t1;
            if (y1 = 0, t1) op1 = [
                op1[0] & 2,
                t1.value
            ];
            switch(op1[0]){
                case 0:
                case 1:
                    t1 = op1;
                    break;
                case 4:
                    _1.label++;
                    return {
                        value: op1[1],
                        done: false
                    };
                case 5:
                    _1.label++;
                    y1 = op1[1];
                    op1 = [
                        0
                    ];
                    continue;
                case 7:
                    op1 = _1.ops.pop();
                    _1.trys.pop();
                    continue;
                default:
                    if (!(t1 = _1.trys, t1 = t1.length > 0 && t1[t1.length - 1]) && (op1[0] === 6 || op1[0] === 2)) {
                        _1 = 0;
                        continue;
                    }
                    if (op1[0] === 3 && (!t1 || op1[1] > t1[0] && op1[1] < t1[3])) {
                        _1.label = op1[1];
                        break;
                    }
                    if (op1[0] === 6 && _1.label < t1[1]) {
                        _1.label = t1[1];
                        t1 = op1;
                        break;
                    }
                    if (t1 && _1.label < t1[2]) {
                        _1.label = t1[2];
                        _1.ops.push(op1);
                        break;
                    }
                    if (t1[2]) _1.ops.pop();
                    _1.trys.pop();
                    continue;
            }
            op1 = body1.call(thisArg1, _1);
        } catch (e1) {
            op1 = [
                6,
                e1
            ];
            y1 = 0;
        } finally{
            f1 = t1 = 0;
        }
        if (op1[0] & 5) throw op1[1];
        return {
            value: op1[0] ? op1[1] : void 0,
            done: true
        };
    }
}
function importNodeModule(name2) {
    if (!name2) throw new Error("import specifier is required");
    var importModule1 = new Function("name", "return import(name)");
    return importModule1(name2).then(function(res1) {
        return res1.default;
    }).catch(function(error1) {
        console.error("Error importing module ".concat(name2, ":"), error1);
        throw error1;
    });
}
function createScriptNode(url, cb, attrs, createScriptHook) {
    if (createScriptHook) {
        var hookResult = createScriptHook(url);
        if (hookResult && typeof hookResult === "object" && "url" in hookResult) url = hookResult.url;
    }
    var urlObj;
    try {
        urlObj = new URL(url);
    } catch (e) {
        console.error("Error constructing URL:", e);
        cb(new Error("Invalid URL: ".concat(e)));
        return;
    }
    var getFetch = function() {
        var _ref1 = _async_to_generator(function() {
            var fetchModule1;
            return _ts_generator(this, function(_state1) {
                switch(_state1.label){
                    case 0:
                        if (!(typeof fetch === "undefined")) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            importNodeModule("node-fetch")
                        ];
                    case 1:
                        fetchModule1 = _state1.sent();
                        //@ts-ignore
                        return [
                            2,
                            (fetchModule1 === null || fetchModule1 === void 0 ? void 0 : fetchModule1.default) || fetchModule1
                        ];
                    case 2:
                        return [
                            2,
                            fetch
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function getFetch1() {
            return _ref1.apply(this, arguments);
        };
    }();
    console.log("fetching", urlObj.href);
    getFetch().then(function(f) {
        f(urlObj.href).then(function(res1) {
            return res1.text();
        }).then(function() {
            var _ref = _async_to_generator(function(data) {
                var _ref, path, vm, scriptContext, urlDirname, filename, script, exportedInterface, container;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                Promise.all([
                                    importNodeModule("path"),
                                    importNodeModule("vm")
                                ])
                            ];
                        case 1:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), path = _ref[0], vm = _ref[1];
                            scriptContext = {
                                exports: {},
                                module: {
                                    exports: {}
                                }
                            };
                            urlDirname = urlObj.pathname.split("/").slice(0, -1).join("/");
                            filename = path.basename(urlObj.pathname);
                            try {
                                script = new vm.Script("(function(exports, module, require, __dirname, __filename) {".concat(data, "\n})"), {
                                    filename: filename
                                });
                                script.runInThisContext()(scriptContext.exports, scriptContext.module, eval("require"), urlDirname, filename);
                                exportedInterface = scriptContext.module.exports || scriptContext.exports;
                                if (attrs && exportedInterface && attrs["globalName"]) {
                                    container = exportedInterface[attrs["globalName"]];
                                    cb(undefined, container);
                                    return [
                                        2
                                    ];
                                }
                                cb(undefined, exportedInterface);
                            } catch (e) {
                                // console.error('Error running script:', e);
                                cb(new Error("Script execution error: ".concat(e)));
                            }
                            return [
                                2
                            ];
                    }
                });
            });
            return function(data1) {
                return _ref.apply(this, arguments);
            };
        }()).catch(function(err1) {
            // console.error('Error fetching script:', err);
            cb(err1);
        });
    });
}
function loadScriptNode(url3, info1) {
    return new Promise(function(resolve1, reject1) {
        createScriptNode(url3, function(error1, scriptContext1) {
            if (error1) reject1(error1);
            else {
                var _info_attrs2, _info_attrs11;
                var remoteEntryKey1 = (info1 === null || info1 === void 0 ? void 0 : (_info_attrs2 = info1.attrs) === null || _info_attrs2 === void 0 ? void 0 : _info_attrs2["globalName"]) || "__FEDERATION_".concat(info1 === null || info1 === void 0 ? void 0 : (_info_attrs11 = info1.attrs) === null || _info_attrs11 === void 0 ? void 0 : _info_attrs11["name"], ":custom__");
                var entryExports1 = globalThis[remoteEntryKey1] = scriptContext1;
                resolve1(entryExports1);
            }
        }, info1.attrs, info1.createScriptHook);
    });
}
exports.BROWSER_LOG_KEY = BROWSER_LOG_KEY;
exports.BROWSER_LOG_VALUE = BROWSER_LOG_VALUE;
exports.EncodedNameTransformMap = EncodedNameTransformMap;
exports.FederationModuleManifest = FederationModuleManifest;
exports.Logger = Logger;
exports.MANIFEST_EXT = MANIFEST_EXT;
exports.NameTransformMap = NameTransformMap;
exports.NameTransformSymbol = NameTransformSymbol;
exports.SEPARATOR = SEPARATOR;
exports.assert = assert;
exports.composeKeyWithSeparator = composeKeyWithSeparator;
exports.createScript = createScript;
exports.createScriptNode = createScriptNode;
exports.decodeName = decodeName;
exports.encodeName = encodeName;
exports.error = error;
exports.generateExposeFilename = generateExposeFilename;
exports.generateShareFilename = generateShareFilename;
exports.generateSnapshotFromManifest = generateSnapshotFromManifest;
exports.getProcessEnv = getProcessEnv;
exports.getResourceUrl = getResourceUrl;
exports.isBrowserEnv = isBrowserEnv;
exports.isDebugMode = isDebugMode;
exports.isManifestProvider = isManifestProvider;
exports.isStaticResourcesEqual = isStaticResourcesEqual;
exports.loadScript = loadScript;
exports.loadScriptNode = loadScriptNode;
exports.logger = logger;
exports.parseEntry = parseEntry;
exports.safeWrapper = safeWrapper;
exports.simpleJoinRemoteEntry = simpleJoinRemoteEntry;
exports.warn = warn;
}),
"966": (function (__unused_webpack_module, exports) {
'use strict';
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var ENCODE_NAME_PREFIX = "ENCODE_NAME_PREFIX";
var FEDERATION_SUPPORTED_TYPES = [
    "script"
];
exports.ENCODE_NAME_PREFIX = ENCODE_NAME_PREFIX;
exports.FEDERATION_SUPPORTED_TYPES = FEDERATION_SUPPORTED_TYPES;
}),
"426": (function (module, __unused_webpack_exports, __webpack_require__) {
'use strict';
var runtime = __webpack_require__(/*! @module-federation/runtime */"638");
var sdk = __webpack_require__(/*! @module-federation/sdk */"70");
var constant = __webpack_require__(/*! ./constant.cjs.js */"966");
function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) Object.keys(e).forEach(function(k) {
        if (k !== 'default') {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: function() {
                    return e[k];
                }
            });
        }
    });
    n["default"] = e;
    return Object.freeze(n);
}
var runtime__namespace = /*#__PURE__*/ _interopNamespace(runtime);
function attachShareScopeMap(webpackRequire) {
    if (!webpackRequire.S || webpackRequire.federation.hasAttachShareScopeMap || !webpackRequire.federation.instance || !webpackRequire.federation.instance.shareScopeMap) return;
    webpackRequire.S = webpackRequire.federation.instance.shareScopeMap;
    webpackRequire.federation.hasAttachShareScopeMap = true;
}
function remotes(options) {
    var chunkId = options.chunkId, promises = options.promises, chunkMapping = options.chunkMapping, idToExternalAndNameMapping = options.idToExternalAndNameMapping, webpackRequire = options.webpackRequire, idToRemoteMap = options.idToRemoteMap;
    attachShareScopeMap(webpackRequire);
    if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach(function(id) {
        var getScope = webpackRequire.R;
        if (!getScope) getScope = [];
        var data = idToExternalAndNameMapping[id];
        var remoteInfos = idToRemoteMap[id];
        // @ts-ignore seems not work
        if (getScope.indexOf(data) >= 0) return;
        // @ts-ignore seems not work
        getScope.push(data);
        if (data.p) return promises.push(data.p);
        var onError = function(error) {
            if (!error) error = new Error("Container missing");
            if (typeof error.message === "string") error.message += '\nwhile loading "'.concat(data[1], '" from ').concat(data[2]);
            webpackRequire.m[id] = function() {
                throw error;
            };
            data.p = 0;
        };
        var handleFunction = function(fn, arg1, arg2, d, next, first) {
            try {
                var promise = fn(arg1, arg2);
                if (promise && promise.then) {
                    var p = promise.then(function(result) {
                        return next(result, d);
                    }, onError);
                    if (first) promises.push(data.p = p);
                    else return p;
                } else return next(promise, d, first);
            } catch (error) {
                onError(error);
            }
        };
        var onExternal = function(external, _, first) {
            return external ? handleFunction(webpackRequire.I, data[0], 0, external, onInitialized, first) : onError();
        };
        // eslint-disable-next-line no-var
        var onInitialized = function(_, external, first) {
            return handleFunction(external.get, data[1], getScope, 0, onFactory, first);
        };
        // eslint-disable-next-line no-var
        var onFactory = function(factory) {
            data.p = 1;
            webpackRequire.m[id] = function(module1) {
                module1.exports = factory();
            };
        };
        var onRemoteLoaded = function() {
            try {
                var remoteName = sdk.decodeName(remoteInfos[0].name, constant.ENCODE_NAME_PREFIX);
                var remoteModuleName = remoteName + data[1].slice(1);
                return webpackRequire.federation.instance.loadRemote(remoteModuleName, {
                    loadFactory: false,
                    from: "build"
                });
            } catch (error) {
                onError(error);
            }
        };
        var useRuntimeLoad = remoteInfos.length === 1 && [
            "script"
        ].includes(remoteInfos[0].externalType) && remoteInfos[0].name;
        if (useRuntimeLoad) handleFunction(onRemoteLoaded, data[2], 0, 0, onFactory, 1);
        else handleFunction(webpackRequire, data[2], 0, 0, onExternal, 1);
    });
}
function consumes(options) {
    var chunkId = options.chunkId, promises = options.promises, chunkMapping = options.chunkMapping, installedModules = options.installedModules, moduleToHandlerMapping = options.moduleToHandlerMapping, webpackRequire = options.webpackRequire;
    attachShareScopeMap(webpackRequire);
    if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach(function(id) {
        if (webpackRequire.o(installedModules, id)) return promises.push(installedModules[id]);
        var onFactory = function(factory) {
            installedModules[id] = 0;
            webpackRequire.m[id] = function(module1) {
                delete webpackRequire.c[id];
                module1.exports = factory();
            };
        };
        var onError = function(error) {
            delete installedModules[id];
            webpackRequire.m[id] = function(module1) {
                delete webpackRequire.c[id];
                throw error;
            };
        };
        try {
            var federationInstance = webpackRequire.federation.instance;
            if (!federationInstance) throw new Error("Federation instance not found!");
            var _moduleToHandlerMapping_id = moduleToHandlerMapping[id], shareKey = _moduleToHandlerMapping_id.shareKey, getter = _moduleToHandlerMapping_id.getter, shareInfo = _moduleToHandlerMapping_id.shareInfo;
            var promise = federationInstance.loadShare(shareKey, shareInfo).then(function(factory) {
                if (factory === false) return getter();
                return factory;
            });
            if (promise.then) promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
            else // @ts-ignore maintain previous logic
            onFactory(promise);
        } catch (e) {
            onError(e);
        }
    });
}
function initializeSharing(param) {
    var shareScopeName = param.shareScopeName, webpackRequire = param.webpackRequire, initPromises = param.initPromises, initTokens = param.initTokens, initScope = param.initScope;
    if (!initScope) initScope = [];
    // handling circular init calls
    var initToken = initTokens[shareScopeName];
    if (!initToken) initToken = initTokens[shareScopeName] = {};
    if (initScope.indexOf(initToken) >= 0) return;
    initScope.push(initToken);
    var promise = initPromises[shareScopeName];
    if (promise) return promise;
    var warn = function(msg) {
        return typeof console !== "undefined" && console.warn && console.warn(msg);
    };
    var initExternal = function(id) {
        var handleError = function(err) {
            return warn("Initialization of sharing external failed: " + err);
        };
        try {
            var module1 = webpackRequire(id);
            if (!module1) return;
            var initFn = function(module1) {
                return module1 && module1.init && // @ts-ignore compat legacy mf shared behavior
                module1.init(webpackRequire.S[shareScopeName], initScope);
            };
            if (module1.then) return promises.push(module1.then(initFn, handleError));
            var initResult = initFn(module1);
            // @ts-ignore
            if (initResult && typeof initResult !== "boolean" && initResult.then) return promises.push(initResult["catch"](handleError));
        } catch (err) {
            handleError(err);
        }
    };
    var promises = webpackRequire.federation.instance.initializeSharing(shareScopeName);
    attachShareScopeMap(webpackRequire);
    var bundlerRuntimeRemotesOptions = webpackRequire.federation.bundlerRuntimeOptions.remotes;
    if (bundlerRuntimeRemotesOptions) Object.keys(bundlerRuntimeRemotesOptions.idToRemoteMap).forEach(function(moduleId) {
        var info = bundlerRuntimeRemotesOptions.idToRemoteMap[moduleId];
        var externalModuleId = bundlerRuntimeRemotesOptions.idToExternalAndNameMapping[moduleId][2];
        if (info.length > 1) initExternal(externalModuleId);
        else if (info.length === 1) {
            var remoteInfo = info[0];
            if (!constant.FEDERATION_SUPPORTED_TYPES.includes(remoteInfo.externalType)) initExternal(externalModuleId);
        }
    });
    if (!promises.length) return initPromises[shareScopeName] = true;
    return initPromises[shareScopeName] = Promise.all(promises).then(function() {
        return initPromises[shareScopeName] = true;
    });
}
function handleInitialConsumes(options) {
    var moduleId = options.moduleId, moduleToHandlerMapping = options.moduleToHandlerMapping, webpackRequire = options.webpackRequire;
    var federationInstance = webpackRequire.federation.instance;
    if (!federationInstance) throw new Error("Federation instance not found!");
    var _moduleToHandlerMapping_moduleId = moduleToHandlerMapping[moduleId], shareKey = _moduleToHandlerMapping_moduleId.shareKey, shareInfo = _moduleToHandlerMapping_moduleId.shareInfo;
    return federationInstance.loadShareSync(shareKey, shareInfo);
}
function installInitialConsumes(options) {
    var moduleToHandlerMapping = options.moduleToHandlerMapping, webpackRequire = options.webpackRequire, installedModules = options.installedModules, initialConsumes = options.initialConsumes;
    initialConsumes.forEach(function(id) {
        webpackRequire.m[id] = function(module1) {
            // Handle scenario when module is used synchronously
            installedModules[id] = 0;
            delete webpackRequire.c[id];
            var factory = handleInitialConsumes({
                moduleId: id,
                moduleToHandlerMapping: moduleToHandlerMapping,
                webpackRequire: webpackRequire
            });
            if (typeof factory !== "function") throw new Error("Shared module is not available for eager consumption: ".concat(id));
            module1.exports = factory();
        };
    });
}
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function initContainerEntry(options) {
    var webpackRequire = options.webpackRequire, shareScope = options.shareScope, initScope = options.initScope, shareScopeKey = options.shareScopeKey, remoteEntryInitOptions = options.remoteEntryInitOptions;
    if (!webpackRequire.S) return;
    if (!webpackRequire.federation || !webpackRequire.federation.instance || !webpackRequire.federation.initOptions) return;
    var federationInstance = webpackRequire.federation.instance;
    var name = shareScopeKey || "default";
    federationInstance.initOptions(_object_spread({
        name: webpackRequire.federation.initOptions.name,
        remotes: []
    }, remoteEntryInitOptions));
    federationInstance.initShareScopeMap(name, shareScope);
    webpackRequire.S[name] = shareScope;
    if (webpackRequire.federation.attachShareScopeMap) webpackRequire.federation.attachShareScopeMap(webpackRequire);
    // @ts-ignore
    return webpackRequire.I(name, initScope);
}
var federation = {
    runtime: runtime__namespace,
    instance: undefined,
    initOptions: undefined,
    bundlerRuntime: {
        remotes: remotes,
        consumes: consumes,
        I: initializeSharing,
        S: {},
        installInitialConsumes: installInitialConsumes,
        initContainerEntry: initContainerEntry
    },
    attachShareScopeMap: attachShareScopeMap,
    bundlerRuntimeOptions: {}
};
module.exports = federation;
}),
"358": (function (__unused_webpack_module, exports, __webpack_require__) {
"use strict";

__webpack_require__.d(exports, {
	get: () => (__webpack_require__.getContainer),
	init: () => (__webpack_require__.initContainer)
});}),
"673": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /home/runner/work/soundq/soundq/node_modules/@rspack/core/node_modules/@module-federation/webpack-bundler-runtime/dist/index.cjs.js */"426");
/* harmony import */var _home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0__);

const __module_federation_runtime_plugins__ = [];
const __module_federation_remote_infos__ = {};
const __module_federation_container_name__ = "soundq_local";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
if (__webpack_require__.initializeSharingData || __webpack_require__.initializeExposesData) {
    const override = (obj, key, value)=>{
        if (!obj) return;
        if (obj[key]) obj[key] = value;
    };
    const merge = (obj, key, fn)=>{
        var _a, _b;
        const value = fn();
        if (Array.isArray(value)) {
            (_a = obj[key]) !== null && _a !== void 0 ? _a : obj[key] = [];
            obj[key].push(...value);
        } else if (typeof value === "object" && value !== null) {
            (_b = obj[key]) !== null && _b !== void 0 ? _b : obj[key] = {};
            Object.assign(obj[key], value);
        }
    };
    const early = (obj, key, initial)=>{
        var _a;
        (_a = obj[key]) !== null && _a !== void 0 ? _a : obj[key] = initial();
    };
    const remotesLoadingChunkMapping = (_b = (_a = __webpack_require__.remotesLoadingData) === null || _a === void 0 ? void 0 : _a.chunkMapping) !== null && _b !== void 0 ? _b : {};
    const remotesLoadingModuleIdToRemoteDataMapping = (_d = (_c = __webpack_require__.remotesLoadingData) === null || _c === void 0 ? void 0 : _c.moduleIdToRemoteDataMapping) !== null && _d !== void 0 ? _d : {};
    const initializeSharingScopeToInitDataMapping = (_f = (_e = __webpack_require__.initializeSharingData) === null || _e === void 0 ? void 0 : _e.scopeToSharingDataMapping) !== null && _f !== void 0 ? _f : {};
    const consumesLoadingChunkMapping = (_h = (_g = __webpack_require__.consumesLoadingData) === null || _g === void 0 ? void 0 : _g.chunkMapping) !== null && _h !== void 0 ? _h : {};
    const consumesLoadingModuleToConsumeDataMapping = (_k = (_j = __webpack_require__.consumesLoadingData) === null || _j === void 0 ? void 0 : _j.moduleIdToConsumeDataMapping) !== null && _k !== void 0 ? _k : {};
    const consumesLoadinginstalledModules = {};
    const initializeSharingInitPromises = [];
    const initializeSharingInitTokens = [];
    const containerShareScope = (_l = __webpack_require__.initializeExposesData) === null || _l === void 0 ? void 0 : _l.containerShareScope;
    early(__webpack_require__, "federation", ()=>(_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default()));
    early(__webpack_require__.federation, "consumesLoadingModuleToHandlerMapping", ()=>{
        const consumesLoadingModuleToHandlerMapping = {};
        for (let [moduleId, data] of Object.entries(consumesLoadingModuleToConsumeDataMapping))consumesLoadingModuleToHandlerMapping[moduleId] = {
            getter: data.fallback,
            shareInfo: {
                shareConfig: {
                    fixedDependencies: false,
                    requiredVersion: data.requiredVersion,
                    strictVersion: data.strictVersion,
                    singleton: data.singleton,
                    eager: data.eager
                },
                scope: [
                    data.shareScope
                ]
            },
            shareKey: data.shareKey
        };
        return consumesLoadingModuleToHandlerMapping;
    });
    early(__webpack_require__.federation, "initOptions", ()=>({}));
    early(__webpack_require__.federation.initOptions, "name", ()=>__module_federation_container_name__);
    early(__webpack_require__.federation.initOptions, "shared", ()=>{
        const shared = {};
        for (let [scope, stages] of Object.entries(initializeSharingScopeToInitDataMapping)){
            for (let stage of stages)if (typeof stage === "object" && stage !== null) {
                const { name, version, factory, eager } = stage;
                if (shared[name]) shared[name].scope.push(scope);
                else shared[name] = {
                    version,
                    get: factory,
                    scope: [
                        scope
                    ]
                };
            }
        }
        return shared;
    });
    merge(__webpack_require__.federation.initOptions, "remotes", ()=>Object.values(__module_federation_remote_infos__).flat().filter((remote)=>remote.externalType === "script"));
    merge(__webpack_require__.federation.initOptions, "plugins", ()=>__module_federation_runtime_plugins__);
    early(__webpack_require__.federation, "bundlerRuntimeOptions", ()=>({}));
    early(__webpack_require__.federation.bundlerRuntimeOptions, "remotes", ()=>({}));
    early(__webpack_require__.federation.bundlerRuntimeOptions.remotes, "chunkMapping", ()=>remotesLoadingChunkMapping);
    early(__webpack_require__.federation.bundlerRuntimeOptions.remotes, "idToExternalAndNameMapping", ()=>{
        const remotesLoadingIdToExternalAndNameMappingMapping = {};
        for (let [moduleId, data] of Object.entries(remotesLoadingModuleIdToRemoteDataMapping))remotesLoadingIdToExternalAndNameMappingMapping[moduleId] = [
            data.shareScope,
            data.name,
            data.externalModuleId,
            data.remoteName
        ];
        return remotesLoadingIdToExternalAndNameMappingMapping;
    });
    early(__webpack_require__.federation.bundlerRuntimeOptions.remotes, "webpackRequire", ()=>__webpack_require__);
    merge(__webpack_require__.federation.bundlerRuntimeOptions.remotes, "idToRemoteMap", ()=>{
        const idToRemoteMap = {};
        for (let [id, remoteData] of Object.entries(remotesLoadingModuleIdToRemoteDataMapping)){
            const info = __module_federation_remote_infos__[remoteData.remoteName];
            if (info) idToRemoteMap[id] = info;
        }
        return idToRemoteMap;
    });
    override(__webpack_require__, "S", (_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.S));
    if ((_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().attachShareScopeMap)) _home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().attachShareScopeMap(__webpack_require__);
    override(__webpack_require__.f, "remotes", (chunkId, promises)=>_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.remotes({
            chunkId,
            promises,
            chunkMapping: remotesLoadingChunkMapping,
            idToExternalAndNameMapping: __webpack_require__.federation.bundlerRuntimeOptions.remotes.idToExternalAndNameMapping,
            idToRemoteMap: __webpack_require__.federation.bundlerRuntimeOptions.remotes.idToRemoteMap,
            webpackRequire: __webpack_require__
        }));
    override(__webpack_require__.f, "consumes", (chunkId, promises)=>_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.consumes({
            chunkId,
            promises,
            chunkMapping: consumesLoadingChunkMapping,
            moduleToHandlerMapping: __webpack_require__.federation.consumesLoadingModuleToHandlerMapping,
            installedModules: consumesLoadinginstalledModules,
            webpackRequire: __webpack_require__
        }));
    override(__webpack_require__, "I", (name, initScope)=>_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.I({
            shareScopeName: name,
            initScope,
            initPromises: initializeSharingInitPromises,
            initTokens: initializeSharingInitTokens,
            webpackRequire: __webpack_require__
        }));
    override(__webpack_require__, "initContainer", (shareScope, initScope, remoteEntryInitOptions)=>_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.initContainerEntry({
            shareScope,
            initScope,
            remoteEntryInitOptions,
            shareScopeKey: containerShareScope,
            webpackRequire: __webpack_require__
        }));
    override(__webpack_require__, "getContainer", (module, getScope)=>{
        var moduleMap = __webpack_require__.initializeExposesData.moduleMap;
        __webpack_require__.R = getScope;
        getScope = Object.prototype.hasOwnProperty.call(moduleMap, module) ? moduleMap[module]() : Promise.resolve().then(()=>{
            throw new Error('Module "' + module + '" does not exist in container.');
        });
        __webpack_require__.R = undefined;
        return getScope;
    });
    (_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().instance) = _home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().runtime.init((_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().initOptions));
    if ((_m = __webpack_require__.consumesLoadingData) === null || _m === void 0 ? void 0 : _m.initialConsumes) _home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().bundlerRuntime.installInitialConsumes({
        webpackRequire: __webpack_require__,
        installedModules: consumesLoadinginstalledModules,
        initialConsumes: __webpack_require__.consumesLoadingData.initialConsumes,
        moduleToHandlerMapping: (_home_runner_work_soundq_soundq_node_modules_rspack_core_node_modules_module_federation_webpack_bundler_runtime_dist_index_cjs_js__WEBPACK_IMPORTED_MODULE_0___default().consumesLoadingModuleToHandlerMapping)
    });
}
}),

}
// The module cache
 var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
// Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
      return cachedModule.exports;
      }
      // Create a new module (and put it into the cache)
      var module = (__webpack_module_cache__[moduleId] = {
       exports: {}
      });
      // Execute the module function
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
// Return the exports of the module
 return module.exports;

}
// expose the modules object (__webpack_modules__)
 __webpack_require__.m = __webpack_modules__;
// expose the module cache
 __webpack_require__.c = __webpack_module_cache__;
// webpack/runtime/ensure_chunk
!function() {
__webpack_require__.f = {};
// This file contains only the entry chunk.
// The chunk loading function for additional chunks
__webpack_require__.e = function (chunkId) {
	return Promise.all(
		Object.keys(__webpack_require__.f).reduce(function (promises, key) {
			__webpack_require__.f[key](chunkId, promises);
			return promises;
		}, [])
	);
};

}();
// webpack/runtime/load_chunk_with_block
!function() {
var map = {"155@": ["512"], "358@./Plugin": ["637", "990"], "537@0:21": ["637"], "734@": ["512"], "871@": ["987", "637"], "886@": ["987"]};

__webpack_require__.el = function(module) {
  var chunkIds = map[module];
  if (chunkIds === undefined) return Promise.resolve();
  if (chunkIds.length > 1) return Promise.all(chunkIds.map(__webpack_require__.e));
  return __webpack_require__.e(chunkIds[0]);
}

}();
// webpack/runtime/has_own_property
!function() {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

}();
// webpack/runtime/define_property_getters
!function() {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
}();
// webpack/runtime/make_namespace_object
!function() {
// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

}();
// webpack/runtime/compat_get_default_export
!function() {
// getDefaultExport function for compatibility with non-harmony modules
__webpack_require__.n = function (module) {
	var getter = module && module.__esModule ?
		function () { return module['default']; } :
		function () { return module; };
	__webpack_require__.d(getter, { a: getter });
	return getter;
};




}();
// webpack/runtime/sharing
!function() {

__webpack_require__.S = {};
__webpack_require__.initializeSharingData = { scopeToSharingDataMapping: { "default": [{ name: "react-dom", version: "16.14.0", factory: function() { return __webpack_require__.el("871@").then(function() { return function() { return __webpack_require__(/*! /home/runner/work/soundq/soundq/node_modules/react-dom/index.js */"935"); }; }); }, eager: 0 }, { name: "react", version: "16.14.0", factory: function() { return __webpack_require__.el("734@").then(function() { return function() { return __webpack_require__(/*! /home/runner/work/soundq/soundq/node_modules/react/index.js */"294"); }; }); }, eager: 0 }] }, uniqueName: "soundq" };
__webpack_require__.I = function() { throw new Error("should have __webpack_require__.I") }

}();
// webpack/runtime/get javascript chunk filename
!function() {
// This function allow to reference chunks
        __webpack_require__.u = function (chunkId) {
          // return url for filenames not based on template
          
          // return url for filenames based on template
          return "" + chunkId + ".js";
        };
      
}();
// webpack/runtime/get css chunk filename
!function() {
// This function allow to reference chunks
        __webpack_require__.k = function (chunkId) {
          // return url for filenames not based on template
          
          // return url for filenames based on template
          return "" + chunkId + ".css";
        };
      
}();
// webpack/runtime/load_script
!function() {
var inProgress = {};

var dataWebpackPrefix = "soundq:";
// loadScript function to load a script via script tag
__webpack_require__.l = function (url, done, key, chunkId) {
	if (inProgress[url]) {
		inProgress[url].push(done);
		return;
	}
	var script, needAttach;
	if (key !== undefined) {
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var s = scripts[i];
			if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) {
				script = s;
				break;
			}
		}
	}
	if (!script) {
		needAttach = true;
		script = document.createElement('script');
		
		script.charset = 'utf-8';
		script.timeout = 120;
		if (__webpack_require__.nc) {
			script.setAttribute("nonce", __webpack_require__.nc);
		}
		script.setAttribute("data-webpack", dataWebpackPrefix + key);
		script.src = url;

		
	}
	inProgress[url] = [done];
	var onScriptComplete = function (prev, event) {
		script.onerror = script.onload = null;
		clearTimeout(timeout);
		var doneFns = inProgress[url];
		delete inProgress[url];
		script.parentNode && script.parentNode.removeChild(script);
		doneFns &&
			doneFns.forEach(function (fn) {
				return fn(event);
			});
		if (prev) return prev(event);
	};
	var timeout = setTimeout(
		onScriptComplete.bind(null, undefined, {
			type: 'timeout',
			target: script
		}),
		120000
	);
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	needAttach && document.head.appendChild(script);
};

}();
// webpack/runtime/global
!function() {
__webpack_require__.g = (function () {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();

}();
// webpack/runtime/consumes_loading
!function() {

__webpack_require__.consumesLoadingData = { chunkMapping: {"987":[],"990":[],"512":[],"637":["155"]}, moduleIdToConsumeDataMapping: { "155": { shareScope: "default", shareKey: "react", import: "react", requiredVersion: "^16.13.0", strictVersion: false, singleton: true, eager: false, fallback: function() { return __webpack_require__.el("155@").then(function() { return function() { return __webpack_require__(/*! react */"294"); }; }); } } }, initialConsumes: [] };
__webpack_require__.f.consumes = function() { throw new Error("should have __webpack_require__.f.consumes") }
}();
// webpack/runtime/jsonp_chunk_loading
!function() {

      // object to store loaded and loading chunks
      // undefined = chunk not loaded, null = chunk preloaded/prefetched
      // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
      var installedChunks = {"350": 0,};
      
        __webpack_require__.f.j = function (chunkId, promises) {
          // JSONP chunk loading for javascript
var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
	? installedChunks[chunkId]
	: undefined;
if (installedChunkData !== 0) {
	// 0 means "already installed".

	// a Promise means "currently loading".
	if (installedChunkData) {
		promises.push(installedChunkData[2]);
	} else {
		if ("637" != chunkId) {
			// setup Promise in chunk cache
			var promise = new Promise(function (resolve, reject) {
				installedChunkData = installedChunks[chunkId] = [resolve, reject];
			});
			promises.push((installedChunkData[2] = promise));

			// start chunk loading
			var url = __webpack_require__.p + __webpack_require__.u(chunkId);
			// create error before stack unwound to get useful stacktrace later
			var error = new Error();
			var loadingEnded = function (event) {
				if (__webpack_require__.o(installedChunks, chunkId)) {
					installedChunkData = installedChunks[chunkId];
					if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
					if (installedChunkData) {
						var errorType =
							event && (event.type === 'load' ? 'missing' : event.type);
						var realSrc = event && event.target && event.target.src;
						error.message =
							'Loading chunk ' +
							chunkId +
							' failed.\n(' +
							errorType +
							': ' +
							realSrc +
							')';
						error.name = 'ChunkLoadError';
						error.type = errorType;
						error.request = realSrc;
						installedChunkData[1](error);
					}
				}
			};
			__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
		} else installedChunks[chunkId] = 0;

	}
}

        }
        // install a JSONP callback for chunk loading
var webpackJsonpCallback = function (parentChunkLoadingFunction, data) {
	var chunkIds = data[0];
	var moreModules = data[1];
	var runtime = data[2];
	// add "moreModules" to the modules object,
	// then flag all "chunkIds" as loaded and fire callback
	var moduleId,
		chunkId,
		i = 0;
	if (chunkIds.some(function (id) { return installedChunks[id] !== 0 })) {
		for (moduleId in moreModules) {
			if (__webpack_require__.o(moreModules, moduleId)) {
				__webpack_require__.m[moduleId] = moreModules[moduleId];
			}
		}
		if (runtime) var result = runtime(__webpack_require__);
	}
	if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
	for (; i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId]
		) {
			installedChunks[chunkId][0]();
		}
		installedChunks[chunkId] = 0;
	}
	
};

var chunkLoadingGlobal = self["webpackChunksoundq"] = self["webpackChunksoundq"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(
	null,
	chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
);

}();
// webpack/runtime/initialize_exposes
!function() {

__webpack_require__.initializeExposesData = {
  moduleMap: {
"./Plugin": function() {
return __webpack_require__.el("358@./Plugin").then(function() { return function() { return __webpack_require__(/*! ./src/App */"130"); }; });
},
  },
  shareScope: "default",
};
__webpack_require__.getContainer = function() { throw new Error("should have __webpack_require__.getContainer") };__webpack_require__.initContainer = function() { throw new Error("should have __webpack_require__.initContainer") };
}();
// webpack/runtime/auto_public_path
!function() {

    var scriptUrl;
    if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
    var document = __webpack_require__.g.document;
    if (!scriptUrl && document) {
      if (document.currentScript) scriptUrl = document.currentScript.src;
        if (!scriptUrl) {
          var scripts = document.getElementsByTagName("script");
              if (scripts.length) {
                var i = scripts.length - 1;
                while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
              }
        }
      }
    
    // When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration",
    // or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.',
    if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
    __webpack_require__.p = scriptUrl
    
}();
__webpack_require__("673");
var __webpack_exports__ = __webpack_require__("358");soundq_local = __webpack_exports__;

})()

//# sourceMappingURL=remoteEntry.js.map