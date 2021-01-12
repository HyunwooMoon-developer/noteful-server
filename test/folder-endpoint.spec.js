/* eslint-disable no-undef */
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const {makeFolderArray} = require('./folder.fixture');



describe('Folders Endpoints', ()=> {
    let db;

    before('make knex instance', ()=>{
        db = knex({
            client : 'pg',
            connection : process.env.TEST_DB_URL,
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy())
    before('clean the table', ()=> db.raw(`TRUNCATE folders, notes RESTART IDENTITY CASCADE`))
    afterEach('cleanup',()=> db.raw(`TRUNCATE folders, notes RESTART IDENTITY CASCADE`))

    describe(`GET /api/folders` , ()=> {
        context('Given no folders', ()=> {
            it(`responds with 200 and an empty list` , ()=> {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200, [])
            })
        })
        context(`Given there are folders in the database` , ()=> {
            const testFolder = makeFolderArray();

            beforeEach('insert folders', ()=>{
                return db
                    .into('folders')
                    .insert(testFolder)
            })
        })
        it('responds with 200 and all of the folders' , ()=>{
            return supertest(app)
            .get('/api/folders')
            .expect(200, testFolder)
        })
    })
})