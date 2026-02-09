import { vi, beforeAll, beforeEach, afterAll, afterEach } from "vitest";

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CACHE_MANAGER } from "@nestjs/cache-manager";

import request from "supertest";

import { setupTestDb, TestDbHelper } from './utils/dbSetup';
import { todos } from "../../db/schema";
import { AppModule } from "../../app.module";
import { DATABASE_CONNECTION } from "../../db/db.module";
import { CreateTodoDto, UpdateTodoDto } from "src/dto/todosDto.dto";

describe('TodosController e2e', () => {
    let app: INestApplication;
    let dbHelper: TestDbHelper;

    const cacheMock = {
        set: vi.fn(),
        get: vi.fn(),
        clear: vi.fn(),
    }

    beforeAll(async () => {
        dbHelper = await setupTestDb();
    });

    afterAll(async () => {
        if (dbHelper) {
            await dbHelper.cleanup();
        }
    })

    beforeEach(async () => {
        cacheMock.set.mockReset();
        cacheMock.get.mockReset();
        cacheMock.clear.mockReset();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(DATABASE_CONNECTION)
            .useValue(dbHelper.db)
            .overrideProvider(CACHE_MANAGER)
            .useValue(cacheMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        if (dbHelper) {
            await dbHelper.db.delete(todos);
        }
        await app.close();
    });

    it('/GET todos', () => {
        return request(app.getHttpServer())
            .get('/todos')
            .expect(200)
    });

    it('/POST todo', () => {
        const todo: CreateTodoDto = {
            name: "ori",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        return request(app.getHttpServer())
            .post('/todos')
            .send(todo)
            .expect(201)
    })

    it('/POST todo with empty name', () => {
        const todo: CreateTodoDto = {
            name: "",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        return request(app.getHttpServer())
            .post('/todos')
            .send(todo)
            .expect(400)
    })

    it('/DELETE todo', async () => {
        const todo: CreateTodoDto = {
            name: "ori",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        const todoid = await dbHelper.db.insert(todos).values(todo).returning({ id: todos.id });

        return request(app.getHttpServer())
            .delete('/todos/' + todoid[0].id)
            .expect(200)
    })

    it('/PATCH todo', async () => {
        const todo: CreateTodoDto = {
            name: "ori",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        const todoid = await dbHelper.db.insert(todos).values(todo).returning({ id: todos.id });

        const updatedTodo: UpdateTodoDto = {
            name: "oriiiii",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        return request(app.getHttpServer())
            .patch('/todos/' + todoid[0].id)
            .send(updatedTodo)
            .expect(200)    
    })

    it('/PATCH toggle todo', async () => {
        const todo: CreateTodoDto = {
            name: "ori",
            subject: "Military",
            priority: 7,
            date: new Date(),
            geometryType: "Point",
            lat: 34.7777,
            lng: 77.7777,
            coordinates: null,
        }

        const todoid = await dbHelper.db.insert(todos).values(todo).returning({ id: todos.id });

        return request(app.getHttpServer())
            .patch('/todos/' + todoid[0].id + '/toggle')
            .expect(200)
    })
})