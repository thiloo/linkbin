DROP TABLE IF EXISTS links;
CREATE TABLE links (
    id SERIAL primary key,
    link VARCHAR(255) not null,
    headline_in_link VARCHAR(255),
    given_title VARCHAR(255),
    username VARCHAR(255) not null,
    votes INTEGER default 0,
    source VARCHAR(255) not null,
    picture_url VARCHAR(255),
    num_of_comments INTEGER default 0,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id SERIAL primary key,
    link_id INTEGER not null,
    comment VARCHAR(255) not null,
    username VARCHAR(255) not null,
    parent_comment_id INTEGER default 0,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR(255) not null UNIQUE,
    password VARCHAR(255) not null,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);
