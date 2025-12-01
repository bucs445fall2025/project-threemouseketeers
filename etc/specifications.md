## Functional Requirements

| Requirement                | Description                                                                 | Acceptance Test                                                                 |
|----------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Account Creation**       | New users can create an account with email and password                     | User email and password stored correctly                                        |
| **Password Authentication**| Users can log in using their registered credentials                         | Only gain access with correct password                                         |
| **Asking Questions**       | Applicants can post questions to students                                    | Post appears in question list                                                  |
| **Answering Questions**    | Students can answer questions submitted by applicants                        | Answer is visible to the applicant                                            |
| **Login Interface**        | UI for account creation and login                                           | Users can create and log in via frontend                                       |
| **Account Deletion**       | Users can delete their account                                              | Confirm account removed from database                                          |
| **Media Handling**         | Users can upload media with questions and answers                           | Media is correctly attached and displayed                                      |
| **Question Search**        | Search questions by keyword(s)                                              | Search returns appropriate results                                            |
| **Question Filtering**     | Filter questions by categories, answered/unanswered, or topics               | Filtering results are accurate                                                |

---

## Non-Functional Requirements

| Requirement               | Description                                             | Acceptance Test                          |
|---------------------------|---------------------------------------------------------|------------------------------------------|
| **Security**              | Sensitive information must remain confidential         | Database not accessible from the internet|
| **Ease of Navigation / UX**| Website is intuitive and visually accessible           | Website is easy to navigate and use     |

## TODO

- Want a method of rating answers (like reddit karma) to incentivize good answers
- Could implement a "user rating" like uber to help filter out bad answers
- Could require that users submit a certain number of answers prior to uploading a tour to incentivize answers