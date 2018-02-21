select amount, description, tdate, category, image
  from transaction, user
  where user = 1
  order by tdate asc;

select tname, amount, description, tdate, category, image
  from transaction, user
  where user = 1
  order by tdate desc;

update balance 
  set amount = 100 
  where user = 1;
