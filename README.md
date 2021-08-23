# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Video Link

https://drive.google.com/file/d/1iKlXZjZROP8Oan5YN4v4lTADiB5liC7Z/view?usp=sharing

## Description

Connect to an MySQL server and perform some employee tracking.

## Table of Contents

- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Usage](#usage)
- [Installation](#installation)
- [License](#license)
- [Questions](#questions)

## User Story

```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Installation

Clone my repo using the following command `git clone https://github.com/Nem-Ajvaz/Employee-Tracker.git`, install inquirer using `npm install inquirer`, install MySQL2 `npm install mysql2`, install console table `npm install console.table`.

If you want to have the console log welcoming message install the following modules:
`npm install chalk clear clui figlet inquirer minimist configstore @octokit/rest @octokit/auth-basic lodash simple-git touch`

## Usage

Navigate the terminal to index.js in the cloned repo and run `node index.js` to run the program

## Questions

For any further questions please reach out to me on email or through my GitHub: <br/>
Email: nemanja.ajvaz@gmail.com <br/>
GitHub: https://github.com/Nem-Ajvaz


## References:

https://www.mysqltutorial.org/mysql-nodejs/connect/ <br/>
https://2u-20.wistia.com/medias/2lnle7xnpk <br/>
https://stackoverflow.com/questions/51713333/how-to-terminate-npm-inquirer-prompt-and-return-control-to-main-menu-function
