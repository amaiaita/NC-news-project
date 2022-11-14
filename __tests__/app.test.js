const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => seed(data));

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("should GET 200: responds with arr of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("should GET 200: responds with arr of articles objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
        });
    });
    test("should GET 200: response is in date descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("should GET 200: responds with article object for correct ID", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toBeInstanceOf(Object);
          expect(article).toMatchObject({
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          });
        });
    });
    test("ERROR 404: ID not found when ID that does not exist is passed", () => {
      return request(app)
        .get("/api/articles/900")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });
    test('should ERROR 400: Bad Request (wrong ID data type) when incorrecvt data type for ID passed', () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid Data Type for ID");
        });
    });
  });
});
