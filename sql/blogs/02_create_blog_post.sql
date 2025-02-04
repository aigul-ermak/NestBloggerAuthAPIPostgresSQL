CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(500) NOT NULL,
    website_url VARCHAR(100) NOT NULL CHECK (website_url ~ '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    created_at TIMESTAMP DEFAULT NOW(),
    is_membership BOOLEAN DEFAULT TRUE
);


CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    short_description VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    blog_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    my_status VARCHAR(20),

    CONSTRAINT fk_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);