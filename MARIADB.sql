create user 'micro'@'%' identified by 'service';

grant all privileges on monolithic.* to 'micro'@'%';

flush privileges;

