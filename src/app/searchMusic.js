'use strict'

var request = require('request');
const CONSTANTS = require('../constants/constants');
var Albums = require('../models/albums');

exports.searchMusic = async (req, res) => {
    let body = await getToken();
    let search = req.body.search;
    let albumsBySearch;
    let schemaList = Array();
    if (body) {
        albumsBySearch = await getAlbums(search, body.access_token);
        if(albumsBySearch.length === 0 || albumsBySearch === undefined) return schemaList;
        schemaList = await processInformation(albumsBySearch);
        if(schemaList.length === 0) return schemaList;
        const albumes = new Albums();
        await albumes.remove();
        let result = await saveInformation(schemaList).catch(err => console.log(err));
        if(result){
            schemaList = await loadInformation().catch(err => console.log(err));
        }
    }
    return schemaList;
}

let getToken = async () => {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: 'code',
            redirect_uri: CONSTANTS.API_CREDENTIALS.REDIRECT_URI,
            grant_type: CONSTANTS.API_CREDENTIALS.GRANT_TYPE,
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(CONSTANTS.API_CREDENTIALS.CLIENT_ID + ':' + CONSTANTS.API_CREDENTIALS.CLIENT_SECRET).toString('base64'))
        },
        json: true
    };
    try {
        return new Promise(function (resolve, reject) {
            request.post(authOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

let getAlbums = async (search, token) => {
    let options = {
        url: `https://api.spotify.com/v1/search?q=album:${search}&type=album&access_token=${token}`,
        json: true
    };
    return new Promise((resolve, reject) => {
        request.get(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        })
    })
}

let processInformation = async (albumsBySearch) => {
    let listSize = albumsBySearch.albums.items.length;
    let listInformation = albumsBySearch.albums.items;
    let schemaList = new Array();

    for (let i = 0; i < listSize; i++) {
        let albumInformation = new Object();
        albumInformation = {
            name : listInformation[i].name,
            total_tracks : Number.parseInt(listInformation[i].total_tracks),
            url : listInformation[i].external_urls.spotify
        }
        schemaList.push(albumInformation);
    }
    return schemaList;
}

let saveInformation = async (schemaList) => {
    let result;
    schemaList.forEach(async schema => {
        const albums = new Albums(schema);
        result = await albums.save();       
    });
    return result;
}

let loadInformation= async () => {
    const albumsFromDb = new Albums();
    return await albumsFromDb.find();
}