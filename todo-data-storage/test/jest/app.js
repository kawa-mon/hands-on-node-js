'use strict'
const fileSystem = require('../../file-system')
const uuid = require('uuid')
const request = require('supertest')

process.env.npm_lifecycle_event = 'file-system'
const app = require('../../app')

jest.mock('../../file-system')
jest.mock('uuid')

afterAll(() => app.close())

describe('app', () => {
  describe('GET /api/todos', () => {
    describe('completedが指定されていない場合', () => {
      test('fetchAll()で取得したToDoの配列を返す', async () => {
        const todos = [
          { id: 'a', title: 'ネーム', completed: false },
          { id: 'b', title: '下書き', completed: true },
        ]
        fileSystem.fetchAll.mockResolvedValue(todos)
        const res = await request(app).get('/api/todos')

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(todos)
      })
      test('fetchAll()が失敗したらエラーを返す', async () => {
        fileSystem.fetchAll.mockRejectedValue(new Error('fetchAll()失敗'))
        const res = await request(app).get('/api/todos')

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: 'fetchAll()失敗' })
      })
    })

    describe('completedが指定されている場合', () => {
      test('completedを引数にfetchByCompleted()を実行し取得したToDoの配列を返す', async () => {
        const todos = [
          { id: 'a', title: 'ネーム', completed: false },
          { id: 'b', title: '下書き', completed: true },
        ]
        fileSystem.fetchByCompleted.mockResolvedValue(todos)
        for (const completed of [true, false]) {
          const res = await request(app).get('/api/todos').query({ completed })

          expect(res.statusCode).toBe(200)
          expect(res.body).toEqual(todos)
          expect(fileSystem.fetchByCompleted).toHaveBeenCalledWith(completed)
        }
      })

      test('fetchByCompleted()が失敗したらエラーを返す', async () => {
        fileSystem.fetchByCompleted.mockRejectedValue(
          new Error('fetchByCompleted()失敗')
        )
        const res = await request(app)
          .get('/api/todos')
          .query({ completed: true })

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual({ error: 'fetchByCompleted()失敗' })
      })
    })
  })

  describe('POST /api/todos', () => {
    test('パラメータで指定したタイトルを引数にcreate()を実行し、結果を返す', async () => {
      uuid.v4.mockReturnValue('a')
      fileSystem.create.mockResolvedValue()
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'ネーム' })

      const expectedTodo = { id: 'a', title: 'ネーム', completed: false }
      expect(res.statusCode).toBe(201)
      expect(res.body).toEqual(expectedTodo)
      expect(fileSystem.create).toHaveBeenCalledWith(expectedTodo)
    })

    test('パラメータにタイトルが指定されていない場合、400エラーを返す', async () => {
      for (const title of ['', undefined]) {
        const res = await request(app).post('/api/todos').send({ title })

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: 'title is required' })
        expect(fileSystem.create).not.toHaveBeenCalled()
      }
    })

    test('create()が失敗したらエラーを返す', async () => {
      fileSystem.create.mockRejectedValue(new Error('create()失敗'))
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'ネーム' })

      expect(res.statusCode).toBe(500)
      expect(res.body).toEqual({ error: 'create()失敗' })
    })
  })

  describe('PUT /api/todos/:id/completed', () => {
    test('パスで指定したIDのToDoのcompletedをtrueに設定し、更新後のToDoを返す', async () => {
      const todo = { id: 'a', title: 'ネーム', completed: true }
      fileSystem.update.mockResolvedValue(todo)
      const res = await request(app).put('/api/todos/a/completed')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(todo)
      expect(fileSystem.update).toHaveBeenCalledWith('a', { completed: true })
    })

    test('update()がnullを返したら404エラーを返す', async () => {
      fileSystem.update.mockResolvedValue(null)
      const res = await request(app).put('/api/todos/a/completed')

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'ToDo not found' })
    })

    test('update()が失敗したらエラーを返す', async () => {
      fileSystem.update.mockRejectedValue(new Error('update()失敗'))
      const res = await request(app).put('/api/todos/a/completed')

      expect(res.status).toBe(500)
      expect(res.body).toEqual({ error: 'update()失敗' })
    })
  })

  describe('DELETE /api/todos/:id/completed', () => {
    test('パスで指定したIDのToDoのcompletedをfalseに設定し、更新後のToDoを返す', async () => {
      const todo = { id: 'a', title: 'ネーム', completed: false }
      fileSystem.update.mockResolvedValue(todo)
      const res = await request(app).delete('/api/todos/a/completed')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(todo)
      expect(fileSystem.update).toHaveBeenCalledWith('a', { completed: false })
    })

    test('update()がnullを返したら404エラーを返す', async () => {
      fileSystem.update.mockResolvedValue(null)
      const res = await request(app).delete('/api/todos/a/completed')

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'ToDo not found' })
    })

    test('update()が失敗したらエラーを返す', async () => {
      fileSystem.update.mockRejectedValue(new Error('update()失敗'))
      const res = await request(app).delete('/api/todos/a/completed')

      expect(res.status).toBe(500)
      expect(res.body).toEqual({ error: 'update()失敗' })
    })
  })

  describe('DELETE /api/todos/:id', () => {
    test('パスで指定したIDのToDoを削除する', async () => {
      fileSystem.remove.mockResolvedValue('a')
      const res = await request(app).delete('/api/todos/a')

      expect(res.status).toBe(204)
      expect(res.body).toEqual({})
      expect(fileSystem.remove).toHaveBeenCalledWith('a')
    })

    test('remove()がnullを返したら404エラーを返す', async () => {
      fileSystem.remove.mockResolvedValue(null)
      const res = await request(app).delete('/api/todos/a')

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ error: 'ToDo not found' })
    })

    test('remove()が失敗したらエラーを返す', async () => {
      fileSystem.remove.mockRejectedValue(new Error('remove()失敗'))
      const res = await request(app).delete('/api/todos/a')

      expect(res.status).toBe(500)
      expect(res.body).toEqual({ error: 'remove()失敗' })
    })
  })
})
