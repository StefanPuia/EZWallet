
create database EZWallet;

create table user (
  id int primary key auto_increment,
  fname varchar(50) not null,
  lname varchar(50) not null,
  email varchar(255) not null,
  token varchar(64) not null
);

create table category (
  id int primary key auto_increment,
  cname varchar(20) not null,
  colour varchar(20) not null,
  icon varchar(100)
);

create table transaction (
  id int primary key auto_increment,
  user int not null,
  amount decimal not null,
  description varchar(100),
  tdate date not null,
  category int not null,
  foreign key(category) references category(id),
  foreign key(user) references user(id)
);

create table budget (
    id int primary key auto_increment,
    user int not null,
    bdate timestamp not null,
    budget float not null,
    foreign key(user) references user(id)
);
