const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointFile = require("../endpoints.json");

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
    describe("topic query", () => {
      test("should GET 200: response filters by topic when topic query given", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            articles.forEach((article) => {
              expect(article).toMatchObject({
                topic: "mitch",
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              });
            });
          });
      });
      test("should GET 200: return empty array when topic that exists but does not have any articles passed", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(0);
          });
      });
      test("should ERROR 404: when topic that does not exist passed", () => {
        return request(app)
          .get("/api/articles?topic=hello")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("topic does not exist");
          });
      });
    });
    describe("sort by query", () => {
      test("should GET 200: sort by correct column", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("should ERROR:400: if unacceptable sort by query passed", () => {
        return request(app)
          .get("/api/articles?sort_by=unicorn")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("unacceptable sort by query");
          });
      });
    });
    describe("order query", () => {
      test("should GET 200: return in ascending order when ASC order given", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles).toBeSortedBy("created_at");
          });
      });
      test("should ERROR:400: if unacceptable order query passed", () => {
        return request(app)
          .get("/api/articles?order=unicorn")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("unacceptable order query");
          });
      });
    });
    describe("limit query", () => {
      test("should GET 200: responds with right number of articles for limit", () => {
        return request(app)
          .get("/api/articles?limit=3")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(3);
          });
      });
      test("should GET 200: responds with 10 articles when no limit given", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(10);
          });
      });
      test("should ERROR:400: if unacceptable limit query passed", () => {
        return request(app)
          .get("/api/articles?limit=no")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("unacceptable limit query");
          });
      });
      test('should GET 200: returns all of the articles if limit higher than nr of articles', () => {
        return request(app)
          .get("/api/articles?limit=300")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(12);
          });
      });
    });
    describe('page query', () => {
      test('should GET 200: returns correct page', () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then((res) => {
            const { articles } = res.body;
            expect(articles.length).toBe(2);
          });
      });
      test("should ERROR:400: if unacceptable page query passed", () => {
        return request(app)
          .get("/api/articles?p=unicorn")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("unacceptable page number query");
          });
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
    test("should GET 200: includes comment count in response", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            comment_count: "11",
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
  describe("POST /api/articles/:article_id/comments", () => {
    test("should POST 201: responds with created comment ", () => {
      const newComment = {
        username: "butter_bridge",
        body: "wow this article is sick",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "wow this article is sick",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    test("should ERROR 400:incorrect comment format", () => {
      const newComment = { username: "butter_bridge" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect Request Format");
        });
    });

    test("should ERROR 400: Incorrect input to one or more body categories", () => {
      const newComment = { username: 13, body: "this article is cool" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Incorrect data input to one or more categories"
          );
        });
    });

    test("ERROR 404: ID not found when ID that does not exist is passed", () => {
      const newComment = {
        username: "butter_bridge",
        body: "wow this article is sick",
      };
      return request(app)
        .post("/api/articles/900/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid article ID");
        });
    });

    test("should ERROR 400: Bad Request (wrong ID data type) when incorrect data type for ID passed", () => {
      const newComment = {
        username: "butter_bridge",
        body: "wow this article is sick",
      };

      return request(app)
        .post("/api/articles/hello/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid Data Type for ID");
        });
    });
    test("should ERROR 400: bad request when non-existent username passed", () => {
      const newComment = {
        username: "amaiaita",
        body: "wow this article is sick",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Incorrect data input to one or more categories"
          );
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
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
    test("should ERROR 400: Malformed Body Bad Request", () => {
      const articleEdit = { title: -12 };
      return request(app)
        .patch("/api/articles/1")
        .send(articleEdit)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect Request Format");
        });
    });
    test("should ERROR 400: Incorrect input to one or more body categories", () => {
      const articleEdit = { inc_votes: "hello" };
      return request(app)
        .patch("/api/articles/1")
        .send(articleEdit)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad Request: Invalid Data Type to one or more categories "
          );
        });
    });
  });
  describe("POST /api/articles", () => {
    test("should POST 201: responds with added article", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "The World is ending!",
        body: "climate change is going to end the world",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "The World is ending!",
            body: "climate change is going to end the world",
            topic: "paper",
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test("should ERROR 400: if body does not have necessary ifnormation", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "The World is ending!",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect Request Format");
        });
    });
    test("should ERROR 400: Author does not exist", () => {
      const newArticle = {
        author: "amaiaita",
        title: "The World is ending!",
        body: "climate change is going to end the world",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Incorrect data input to one or more categories"
          );
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET /api/users", () => {
    test("should GET 200: return array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          const { users } = res.body;
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/users/:username", () => {
    test("should GET 200: responds with user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then((res) => {
          const { user } = res.body;
          expect(user).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    test("should ERROR 404: when non-existent username given", () => {
      return request(app)
        .get("/api/users/amaiaita")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username does not exist");
        });
    });
  });
});

describe("/api", () => {
  describe("GET /api", () => {
    test("should GET 200: return JSON describing all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const { endpoints } = res.body;
          expect(endpoints).toEqual(endpointFile);
          expect(endpoints).toMatchObject({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
            "GET /api/users": expect.any(Object),
          });
        });
    });
  });
});

describe("/api/comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("should DELETE 204: no content when successfully deleted", () => {
      return request(app).delete("/api/comments/3").expect(204);
    });
    test("should ERROR 404: id does not exist", () => {
      return request(app)
        .delete("/api/comments/199")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Invalid Comment ID - This comment does not exist"
          );
        });
    });
    test("should ERROR 400: Invalid ID data type", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Comment ID - ID is not a number");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("should PATCH 200: responds with updated comment ", () => {
      const commentEdit = { inc_votes: 12 };
      return request(app)
        .patch("/api/comments/1")
        .send(commentEdit)
        .expect(200)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            created_at: expect.any(String),
            votes: 28,
            article_id: 9,
            author: "butter_bridge",
          });
        });
    });
    test("should ERROR 400: if malformed body", () => {
      const commentEdit = { title: -12 };
      return request(app)
        .patch("/api/comments/1")
        .send(commentEdit)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect Request Format");
        });
    });
    test("should ERROR 400: Incorrect input to one or more body categories", () => {
      const commentEdit = { inc_votes: "hello" };
      return request(app)
        .patch("/api/comments/1")
        .send(commentEdit)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad Request: Invalid Data Type to one or more categories "
          );
        });
    });
    test("should ERROR 404: ID Not Found", () => {
      const commentEdit = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/99")
        .send(commentEdit)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Invalid Comment ID - This comment does not exist"
          );
        });
    });
    test("should ERROR 400: Incorrect ID Data Type", () => {
      const commentEdit = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/hello")
        .send(commentEdit)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Comment ID - ID is not a number");
        });
    });
  });
});
