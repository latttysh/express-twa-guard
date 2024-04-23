import express from "express";
import assert from 'assert';
import { TwaGuardMiddleware } from ".";

describe("Testing TwaGuard middleware", () => {
    const USER_DATA = `query_id=AAEjgEoQAAAAACOAShBhpACC&user=%7B%22id%22%3A273317923%2C%22first_name%22%3A%227yon%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22dev7yon%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1713809002&hash=0dc226eb16608a6654027a832bc54c8103306a74ed9fed91444f436fd1acd53c`
    const TELEGRAM_BOT_TOKEN = `6348232744:AAGLZjr6iMuZ2JITh1Ne2nFTheON8q-E_9o`

    it('Should throw if telegram bot token is not provided', () => {
        try {
            // @ts-ignore
            TwaGuardMiddleware()
        } catch (err) {
            assert.ok(err)
            assert.equal(err.message, "Telegram bot token is required")
        }
    })

    it("Should throw 401 if header is not provided and custom error not set", () => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {}
        TwaGuardMiddleware({ telegramBotToken: 'test' })(req, res, (err) => {
            assert.ok(err)
            assert.equal(err.code, 401)
        })
    })

    it("Should throw custom 999 error", () => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {}
        TwaGuardMiddleware({ telegramBotToken: 'test', failedStatusCode: 999 })(req, res, (err) => {
            assert.ok(err)
            assert.equal(err.code, 999)
        })
    })

    it("Should throw custom message like 'Hello world!'", () => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {}
        TwaGuardMiddleware({ telegramBotToken: 'test', failedStatusText: 'Hello world!' })(req, res, (err) => {
            assert.ok(err)
            assert.equal(err.message, "Hello world!")
        })
    })

    it("Should throw custom message like 'Hello world!' and custom 999 error code", () => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {}
        TwaGuardMiddleware({ telegramBotToken: 'test', failedStatusText: 'Hello world!', failedStatusCode: 999 })(req, res, (err) => {
            assert.ok(err)
            assert.equal(err.message, "Hello world!")
            assert.equal(err.code, 999)
        })
    })

    it("Should work", (done) => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {
            "telegram-data": USER_DATA
        }
        TwaGuardMiddleware({ telegramBotToken: TELEGRAM_BOT_TOKEN })(req, res, () => {
            assert(typeof req.user !== 'undefined')
            done()
        })
    })

    it("Should work with custom header", (done) => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {
            "custom-header": USER_DATA
        }
        TwaGuardMiddleware({ telegramBotToken: TELEGRAM_BOT_TOKEN, header: "custom-header" })(req, res, () => {
            assert(typeof req.user !== 'undefined')
            done()
        })
    })

    it("Should throw error because user data is malformed", () => {
        const req = {} as express.Request;
        const res = {} as express.Response;
        req.headers = {
            "telegram-data": "test"
        }
        TwaGuardMiddleware({ telegramBotToken: TELEGRAM_BOT_TOKEN })(req, res, (err) => {
            assert.ok(err)
            assert.equal(err.code, 401)
        })
    })


})