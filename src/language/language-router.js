const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./linked-list')
const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })

    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const lang = await LanguageService.getUsersLanguage(
        req.app.get('db'), 
        req.user.id,
      )
      const word = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        nextWord: word[0].original,
        wordCorrectCount: word[0].correct_count,
        wordIncorrectCount: word[0].incorrect_count,
        totalScore: lang.total_score
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .route('/guess')
  .post(requireAuth, jsonBodyParser, async (req, res, next) => {
    // implement me
    let guess = req.body.guess
    
    try {
      const word = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )
      const lang = await LanguageService.getUsersLanguage(
        req.app.get('db'), 
        req.user.id,
      )
      const head = await LanguageService.getWordHead(
        req.app.get('db'),
        req.language.head
      )
      
      if(!guess) {
        return res.status(400).json({ error: "Missing 'guess' in request body" })
      }
      
      const newList = new LinkedList();
      newList.insertFirst(head)
      let current = word.find( item => item.id === head.next );
      while(current) {
        newList.insertLast(current)
        current = word.find( item => item.id === current.next );
      }
      newList.displayList();

      let oldHead = newList.head.value;
      let currentNode = oldHead;
      let isCorrect;

      if(guess !== currentNode.translation) {
        currentNode.incorrect_count++;
        currentNode.memory_value = 1;
        isCorrect = false;
      }
      if (guess === currentNode.translation) {
        currentNode.correct_count++;
        currentNode.memory_value *= 2;
        language.total_score++;
        isCorrect = true;
      }
   
    } catch(error) {
      console.log(error)
      next(error)
    }
    res.send(201)
    console.log('guess sent')
  })

module.exports = languageRouter