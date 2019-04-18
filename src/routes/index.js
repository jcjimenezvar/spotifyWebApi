const express = require('express')
const router = express.Router();
const searchMusic = require('../app/searchMusic')

router.get('/', (req, res) => {    
    res.render('index')
})


router.get('/home', async (req, res) => {
    res.render('home')
})

router.post('/search', async (req, res) => {
    let albumsBySearch = await searchMusic.searchMusic(req, res);
    let context = new Object();
    if(albumsBySearch.lenght === 0){
        context = {
            noInformation : `No se encontro información para la busqueda ${req.body.search}`
        }
    }else{
        context = {
            information : `Resultados para la busqueda ${req.body.search}`,
            albumsBySearch
        }
    } 
    res.render('home', context)
})

module.exports = router;