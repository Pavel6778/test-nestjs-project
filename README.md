## Description

This is a simple test project.
The logic of work is the following:
1. you can register or log in using an already created user (creds: { email: first@test.com; pass: first })
2. after which you will have access to the protected endpoint (but it will be available only for 1 hour after which your session will be destroyed)
3. you can log in again but only after 5 minutes after your session has been destroyed

has also been added:
1. login using passport (session is stored in radish)
2. basic validation using DTO 
3. logging of all endpoints

## Running the app

```bash
# All the start logic is already described in the docker compose file, so to start the app you just need to run the command
$ docker compose up
```

## Example of using the app

```bash
# register
$ curl http://localhost:3000/auth/register -c cookie.test.txt -d 'email=new.email@test.com&password=password&confirmationPassword=password&firstName=New&lastName=Test'

# login
$ curl http://localhost:3000/auth/login -c cookie.test.txt -d 'email=new.email@test.com&password=password'

# protected url (after 1 hour you will get error)
$ curl http://localhost:3000/some-protected-url -b cookie.test.txt
```


