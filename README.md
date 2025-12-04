# VisitU
## CS 445 Final Project
### Fall 2025

### Team: 1
- John Birchwood
- David Krein
- Senih Okuyucu

## Getting Started
VisitU provides the (skeleton) of a forum where prospective students can get real, unfiltered answers from current university students. We provide an email authentication service to ensure that every student that registers has a valid .edu address. Questions can be asked, answered, and voted for on the forum, and these can be searched for by keyword or filtered by topic.  

### Roadmap
Some more features that we would like to implement in the future:
  [ ] Make profiles available to other users to see
  [ ] Media storage in questions
  [ ] Ability to delete/modify questions
  [ ] Ensure that votes cannot be cast twice for the same answer
  [ ] More styling and CSS
  [ ] Allow students to be affiliated with their university (instead of just Binghamton)
  [ ] More information tabs, such as virtual tours or one-on-one conversations (IMs).

  
## SRS
[document](https://docs.google.com/document/d/12DsNEMQ8mKmnUCKPs4pd9fqYqOPG6glpnzyLyo8Cbg0/edit?pli=1&tab=t.0)
  
### Prerequisites
* [Docker](https://www.docker.com/)
If running outside of Docker:
* Node Alpine 3.21
* MySQL 8.0
* SvelteKit 2.49.0
* NginX 1.29.3
* An email account from which verification emails can be sent -- this will need to be updated in the source code since currently it uses our email & password.

### Installing
Rename the `.env-template` to just `.env` and fill in the required fields with the specifics of your database and session information. 
* `MYSQL_ROOT_PASSWORD` -- The superuser password for MySQL
* `MYSQL_DATABASE` -- The name of the database which to create/populate
* `MYSQL_USER` -- The MySQL username the app will connect with
* `MYSQL_PASSWORD` -- Password for the above MySQL user
* `SESSION_SECRET` -- A string used by `express-session` (a package installed with `npm install`, automatically installed when running in docker) to sign session cookies
* `SESSION_COOKIE_NAME` -- The name of the cookie that will be sent to the browser to track sessions
* `GOOGLE_APP_PASSWORD` -- The password to your node mailer email account

Then, it should be as simple as running ```docker compose up``` to run the project. This automatically handles `npm install` and other setup commands, like running the init.sql script to set up the database and launching the frontend. To run outside of docker, you can run all of these manually, following the commands listed in the dockerfiles.

### Viewing the project

Furthemore, the project is currently up and running on Senih's [home server](https://visitu.seniho.com/). Feel free to visit and test out the functionality here.

## Built With
* [requests](https://docs.python-requests.org/en/latest/user/quickstart/#make-a-request) - request for humans
* [Docker](https://www.docker.com/)
* [SvelteKit](https://svelte.dev/)
* [MySQL](https://www.mysql.com/)
* [Node](https://nodejs.org/en)
* [NginX](https://nginx.org/)
* [Nodemailer](https://nodemailer.com/)

## License
We are using the MIT license. See `LICENSE.md` for more.

## Acknowledgments
* Reddit and other forum websites for providing the structural basis of the forum design.
* Professor Moore and class staff for their continued instruction and support.
