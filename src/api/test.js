//api testing script
//run with 'npm run test'

const app = require('./api')
const assert = require('assert')
const test = require('node:test')
const { generateUsername } = require('unique-username-generator')

const { createUser, verifyUser, fetchUserbyEmail } = require('./password_storage.js');
const { addQuestion, vote, answerQuestion } = require('./questions.js');
const { getBio, setBio } = require('./user_bio.js');

const API_BASE = 'http://api:8080'
const API_KEY = ''

const user1 = generateUsername("",2)
const email1 = generateUsername("",2)
const pass1 = generateUsername("",2)
const user2 = generateUsername("",2)
const pass2 = generateUsername("",2)
const email2 = generateUsername("",2)


test('Begin Testing', (t) => {
    console.log("Hello World")
    assert.strictEqual(1, 1)
});


test('Accounts', async (t) => {
    await t.test('createUser 1', async (t) => {
        const result = await createUser( {user1, email1, pass1} )
    })
    await t.test('verifyUser', async (t) => {
        const result = await verifyUser( {email1, pass1} )
    })
    await t.test('fetchUserbyEmail', async (t) => {
        const result = await fetchUserbyEmail(email1)
    })
    await t.test('createUser 2', async (t) => {
        const result = await createUser( {user2, email2, pass2} )
    })
});


test('Questions', async (t) => {
    let qid, aid
    await t.test('addQuestion', async (t) => {
        const result = await addQuestion( 'What is love?', user1, 'logistics' )
        qid = result.id
    })
    await t.test('answerQuestion', async (t) => {
        const result = await answerQuestion( qid, 'Baby dont hurt me.', user2 )
    })
    await t.test('vote', async (t) => {
        const result = await vote( 1 )
    })
});

test('Profiles', async (t) => {
    await t.test('getBio', async (t) => {
        const result = await getBio( user1 )
    })
    await t.test('setBio', async (t) => {
        const result = await setBio( user1, 'Hello, its me.' )
    })
});