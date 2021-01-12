/* eslint-disable no-undef */
const { expect } = require('chai');
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
        it('responds with 200 and all of the folders' , ()=>{
            return supertest(app)
            .get('/api/folders')
            .expect(200, testFolder)
        });

      });
    });
    describe('POST /api/folders' , () => {
        it('create a folder, respondig with 201 and the new folder' , () => {
            const newFolder={
                folder_name : 'D'
            }
            
            return supertest(app)
                .post('/api/folders')
                .send(newFolder)
                .expect(201)
                .expect(res => {
                    expect(res.body.folder_name).to.eql(newFolder.folder_name)
                })
                .then(postRes => 
                    supertest(app)
                    .get(`/api/folders/${postRes.body.id}`)
                    )
        })
    /*    const requiredField = ['folder_name'];

        requiredField.forEach(field=>{
            const newFolder = {
                folder_name : 'D'
            }
           it(`responds with 400 and an error message when the '${field}' is missing`, ()=>{
               delete newFolder[field]
               return supertest(app)
                    .post(`/api/folders`)
                    .send(newFolder)
                    .expect(400, {
                        error: {message : `Missing '${field}' in request body`}
                    })
           })
        })*/
    })
    describe(`Delete /api/folders/:folder_id`, () => {
        context(`Given no folders` , () => {
            it('responds with 404' , ()=> {
                const folderId = 123456;
                return supertest(app)
                        .delete(`/api/folders/${folderId}`)
                        .expect(404, {error : {message: `Folder doesn't exist`}})
            });
        });
        context(`Given there are folders in the database` , () => {
            const testFolder = makeFolderArray();
            beforeEach('insert folders', ()=>{
                return db
                    .into('folders')
                    .insert(testFolder)
            });
        it(`Responds with 204 and removes the folder` , ()=>{
            const idToRemove = 2;
            const expectedFolder = testFolder.filter(folder => folder.id !==idToRemove)
            return supertest(app)
                    .delete(`/api/folders/${idToRemove}`)
                    .expect(204)
                    .then(() => supertest(app)
                                .get('/folders')
                                .expect(expectedFolder)
                                )
        })    
        })
    })
})