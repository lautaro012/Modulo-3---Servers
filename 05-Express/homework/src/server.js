// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 1;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// methods:
const PATH = '/posts';

// TODO: your code to handle requests

server.post(PATH, (req, res) => {
    const {author, title, contents} = req.body
    console.log(author, title, contents);
    
    if(!author || !title || !contents) {
        return res
            .status(STATUS_USER_ERROR)
            .json({
                error: "No se recibieron los parámetros necesarios para crear el Post"
            });
        //el JSON me da un content type de tipo json. el SEND me da un content type TEXT.
    }

    const post = {
        author, title, contents, id : id++
    };

    posts.push(post)

    res.status(200).json(post);
})


server.post(`${PATH}/author/:author`, (req, res) => {
    let {author} = req.params;
    let {title, contents} = req.body;

    if(!author || !title || !contents) {
        return res
        .status(STATUS_USER_ERROR)
        .json({
                error: "No se recibieron los parámetros necesarios para crear el Post"
            });
            //el JSON me da un content type de tipo json. el SEND me da un content type TEXT.
        }
        const post = {
            author, title, contents, id : id++
        };

})

server.get(PATH, (req, res) => {
    let {term} = req.query; 
    if(term) {
        const term_post = posts.filter((p) => p.title.includes(term) || p.contents.includes(term));
        
         res.json(term_post);
    }
    
         res.json(posts);

})

server.get(`${PATH}/:author`, (req, res) => {

    let { author } = req.params

    const post_author = posts.filter(p => p.author == author);
    console.log(post_author);

    if(post_author.length > 0) {

        res.json(post_author)

    } else {

         res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
    }

})


server.get(`${PATH}/:author/:title`, (req, res) => {
    let {author, title} = req.params;
    
    const post_author_title = posts.filter(p => p.author === author && p.title === title)

    if(post_author_title.length > 0) {
        res.json(post_author_title)
    } else {
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"});
    }
})

server.put(PATH, (req, res) => {
    let {id, title, contents} = req.body
    if (id && title && contents) {
        const finded = posts.find(p => p.id === parseInt(id));
        if(finded) {
            finded.title = title
            finded.contents = contents
            res.json(finded);
        } else {
            res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
        }
    } else {
        res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }
})

server.delete(PATH, (req, res) => {
    let {id} = req.body;

    const post = posts.find(p => p.id == id);
    if(!id || !post){        // SI NO HAY POST CON ES ID.
    res
        .status(STATUS_USER_ERROR)
        .json({error: 'no hay nada :C'})
    }
    posts = posts.filter(p => p.id !== parseInt(id)) //borra el post con el id
    res.json({ success: true })
})

server.delete('/author' , (req, res) => {

    let {author} = req.body;
    const author_found = posts.find(a => a.author == author);

    if(!author || !author_found) {
        return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"})
    }

    let delete_author = posts.filter(a => a.author == author)
    posts = posts.filter(p => p.author !== author);  
    
    
    res.json(delete_author);
    console.log(delete_author);
    console.log(posts);
})


module.exports = { posts, server };
