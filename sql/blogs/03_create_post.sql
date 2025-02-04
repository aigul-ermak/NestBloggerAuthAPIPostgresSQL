CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    short_description VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    blog_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    my_status VARCHAR(20),

    CONSTRAINT fk_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);
