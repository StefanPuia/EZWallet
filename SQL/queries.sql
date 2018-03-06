select distinct transaction.amount, transaction.description, transaction.tdate, category.cname, transaction.image
  from transaction
  inner join category on transaction.category = category.id
  where transaction.user = 1
  order by transaction.tdate asc;
  
select distinct transaction.amount, transaction.description, transaction.tdate, category.cname, transaction.image
  from transaction
  inner join category on transaction.category = category.id
  where transaction.user = 1
  order by transaction.tdate desc;

update budget
  set amount = 100 
  where user = 1;
