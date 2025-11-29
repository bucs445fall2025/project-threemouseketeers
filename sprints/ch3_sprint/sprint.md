# **Project Overview**

## **Application Vision/Goal:**
[Describe the overall purpose and vision of the application. What problem does it solve? Who is the target audience?]
We would like to create a website where prospective university students can get information about a college from real life students. Contrary to other similar platforms, ours will require a valid .edu email address to confirm your identity as a student and will be separate from any official university body, allowing for uncensored information. 

## **Scope:**
[List the major features and functionalities that define the scope of the project. Keep this high-level to avoid feature creep.]
-Student signup with university email verification.
-FAQ page for publicly asked questions.
-Matchmaking for applicants and current students.

## **Deliverables:**
[List what will be delivered by the end of the project, such as a working MVP (Minimum Viable Product), specific features, documentation, etc.]
- Website with features listed above.
- SRS document.
- Documentation of code for future maintenance.

## **Success Criteria:**
[Define what will make this project successful. Examples include meeting deadlines, delivering core functionality, or achieving performance benchmarks.]
- All core functionalities (signup, Q&A, matchmaking) are working by the final project milestone
- Verification system reliably restricts access to verified .edu email users
- Smooth user experience with intuitive navigation and responsive design
- Meet (most) major deadlines and milestones according to the project plan

## **Assumptions:**
[List any assumptions about the technology, users, or resources that could impact development.]
- Students give credible information.
- Users on a compatible browser.
- Our stack is compatible with itself.
- Small enough userbase to fit on our server.

## **Risks:**
[Identify potential risks and challenges, such as technical limitations, resource constraints, or dependency issues.]
- Could run out of time.
- Scope creep.
- Students might not be comfortable critiquing the university with their name attached.
- Need enough students to handle all applicant questions.

## **Design / Architectural Review:**
[Outline the initial thoughts on application architecture. Will it be monolithic or microservices? Will it use a database? What major components will be included?]
- It will be microservices in that it will be containerized and all communication will happen over a network.
- We will use databases for accounts, questions & answers, and other information (several databases in the microservices style)

## **Test Environment:**
[Define how the application will be tested. Will you use automated tests? What environment will the tests run in?]
- We will run tests each sprint to make sure the product is working in its current form.
- Test environment TBD
- Run unit tests every push to ensure nothing broke
  - Can be implemented via Github Actions (.github/workflows/)

---

# **Team Setup**

## **Team Members:**
John Birchwood, David Krein, Senih Okuyucu

## **Team Roles:**
[Define roles for each team member, such as developer, designer, project manager, QA tester, etc.]
John Birchwood: Developer/QA + Testing
David Krein: Lead Front End Developer
Senih Okuyucu: Networking/Server routing/ API/ Techno Wizard 

## **Team Norms:**
[Establish how the team will communicate, how often meetings will happen, and any other ground rules for collaboration.]
Chats will occur on discord. We will be using class time to work on the project and meeting outside of class when necessary.
Code sharing will take place on github.
-Weekly meeting times TBD

## **Application Stack:**
[List all the technologies being used in the project, including programming languages, frameworks, and tools.]
- Svelte for frontend/UI
  - Uses typescript/html
- Node.js for backend
  - javascript
- MySQL for database
- Nginx for webserver

### **Libraries/Frameworks:**
[List any specific libraries or frameworks your application will use, such as React, Flask, Django, etc.]
- Svelte frontend framework