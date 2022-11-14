const db = require("../db/connection");

exports.obtainArticles = () => {
  return db.query(`   
        SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        JOIN comments ON comments.article_id=articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `).then((res)=>{
        return res.rows
    });
};
