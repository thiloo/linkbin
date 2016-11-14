DROP TABLE IF EXISTS links;
CREATE TABLE links (
    id SERIAL primary key,
    url VARCHAR(710) not null,
    link_headline VARCHAR(255),
    description VARCHAR(2000),
    username VARCHAR(255) not null,
    votes INTEGER default 0,
    source VARCHAR(255) not null,
    picture_url VARCHAR(710),
    num_of_comments INTEGER default 0,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id SERIAL primary key,
    link_id INTEGER not null,
    comment VARCHAR(2000) not null,
    username VARCHAR(255) not null,
    parent_id INTEGER default 0,
    num_of_replies INTEGER default 0,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR(255) not null UNIQUE,
    password VARCHAR(255) not null,
    voted_links INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP default CURRENT_TIMESTAMP
);
