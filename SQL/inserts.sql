insert into user(fname, lname, email, token) 
  values ('James', 'Coyle', 'jamescoyle@mail.com', '123456');

insert into user(fname, lname, email, token, budget) 
  values ('John', 'Smith', 'johnsmith@mail.com', '654321');

insert into balance(user, bdate, amount) 
  values (1, '2018/01/01', 60)

insert into category(cname) 
  values ('groceries');

insert into category(cname) 
  values ('transport');

insert into transaction(user, amount, description, tdate, category, image) 
  values (1, 20, 'shopping', '2018/01/01', 1);

insert into transaction(user, amount, description, tdate, category, image) 
  values (1, 15, 'travel', '2017/11/12', 2);
