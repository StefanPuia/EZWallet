select budget.budget as Remaining_Budget from budget
  inner join user on budget.user = user.id
  where user.email = 'johnsmith@mail.com';

select distinct transaction.amount as Amount, transaction.description as Description, transaction.tdate as Date, category.cname as Category, transaction.image as Imagege
  from transaction
  inner join category on transaction.category = category.id
  where transaction.user = 1
  order by transaction.tdate desc;

select distinct transaction.amount as Amount, transaction.description as Description, transaction.tdate as Date, category.cname as Category, transaction.image as Image
  from transaction
  inner join category on transaction.category = category.id
  where transaction.user = 1
  order by transaction.tdate asc;

update budget
  set amount = 100
  where user = 1;
