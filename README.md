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
  [ ] Media storage in questions
  [ ] More styling and CSS
  [ ] Ensure that votes cannot be cast twice for the same answer
  
## SRS
[document](https://docs.google.com/document/d/12DsNEMQ8mKmnUCKPs4pd9fqYqOPG6glpnzyLyo8Cbg0/edit?pli=1&tab=t.0)
  
### Prerequisites
* [Docker](https://www.docker.com/)
* <<any additional software. Be specific about versions.>>
If running outside of Docker:
* Node Alpine 3.21
* MySQL 8.0
* SvelteKit 2.49.0

### Installing
Rename the `.env-template` to just `.env` and fill in the required fields with the specifics of your database and session information. 
* `MYSQL_ROOT_PASSWORD` -- The superuser password for MySQL
* `MYSQL_DATABASE` -- The name of the database which to create/populate
* `MYSQL_USER` -- The MySQL username the app will connect with
* `MYSQL_PASSWORD` -- Password for the above MySQL user
* `SESSION_SECRET` -- A string used by `express-session` (a package installed with `npm install`, automatically installed when running in docker) to sign session cookies
* `SESSION_COOKIE_NAME` -- The name of the cookie that will be sent to the browser to track sessions
Then, it should be as simple as running ```docker compose up``` to run the project. 

## Built With
* [requests](https://docs.python-requests.org/en/latest/user/quickstart/#make-a-request) - request for humans
* [SvelteKit]()
* [MySQL]()

## License
We are using the MIT license. See `LICENSE.md` for more.

## Acknowledgments
* Reddit for providing the structural basis of the forum design
* Professor Moore for his continued instruction and support
