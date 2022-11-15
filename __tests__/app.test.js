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
    test("should ERROR 400: Bad Request (wrong ID data type) when incorrect data type for ID passed", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid Data Type for ID");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("should GET 200: responds with array of comments for a specific article ID ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    test("should be in DESC created at order ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("should GET 200: return empty arr when valid article ID passed that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(0);
        });
    });
    test("should ERROR 404 ID Does not exist", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid article ID");
        });
    });
    test("should ERROR 400: Invalid ID data type", () => {
      return request(app)
        .get("/api/articles/no/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID data type");
        });
    });
  });
});

describe.only("PATCH /api/articles/:article_id", () => {
  test("should PATCH 200: returns updated article for positive vote change", () => {
    const articleEdit = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleEdit)
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 112,
          article_id: 1,
        });
      });
  });
  test("should PATCH 200: returns updated article for negative vote change", () => {
    const articleEdit = { inc_votes: -12 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleEdit)
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 88,
          article_id: 1,
        });
      });
  });
  test.skip("should ERROR 400: Malformed Body Bad Request", () => {
    const articleEdit = { title: -12 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleEdit)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect Request Format");
      });
  });
  test.skip("should ERROR 400: Incorrect input to one or more body categories", () => {
    const articleEdit = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(articleEdit)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect data input to one or more categories");
      });
  });
});
