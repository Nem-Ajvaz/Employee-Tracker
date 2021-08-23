const inquirer = require("inquirer");
const mysql = require("mysql2");
const dispTable = require("console.table");
//Importing Styling elements for the welcome message in the console.
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

// https://www.mysqltutorial.org/mysql-nodejs/connect/
//https://2u-20.wistia.com/medias/2lnle7xnpk
// export PATH="${PATH}:/usr/local/mysql/bin/"
//https://stackoverflow.com/questions/51713333/how-to-terminate-npm-inquirer-prompt-and-return-control-to-main-menu-function

//Clear the terminal
clear();
//When the app is run display the following in the console.
console.log(
  chalk.yellow(
    figlet.textSync("Employee   Manager \n by Nemanja Ajvaz", {
      horizontalLayout: "fitted",
    })
  )
);

// create the connection information for the sql database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ChangeMe124",
  database: "employee_tracker_db",
});

db.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
  questions();
});

const questions = () => {
  return inquirer
    .prompt({
      type: "list",
      name: "init",
      message: "What would you like to do? (Use arrow keys)",
      choices: [
        "View All Employees",
        "Add Employee",
        "View Employees By Manager",
        "View Employees By Department",
        "Update Employee Manager",
        "Update Employee Role",
        "Delete Employee",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View All Departments",
        "View Department Budget",
        "Add Department",
        "Delete Department",
        "Exit",
      ],
    })
    .then((response) => {
      //   console.log(response.init);
      switch (response.init) {
        case "View All Employees":
          {
            viewAllEmployees();
          }
          break;
        case "Add Employee":
          {
            addEmployee();
          }
          break;
        case "Update Employee Role":
          {
            updateEmplyoyeeRole();
          }
          break;
        case "View Employees By Department":
          {
            viewEmployeesByDepartment();
          }
          break;
        case "View Employees By Manager":
          {
            viewEmployeesByManager();
          }
          break;
        case "Update Employee Manager":
          {
            updateEmployeeManager();
          }
          break;
        case "Delete Employee":
          {
            deleteEmployee();
          }
          break;
        case "View All Roles":
          {
            viewAllRoles();
          }
          break;
        case "Add Role":
          {
            addRole();
          }
          break;
        case "Delete Role":
          {
            deleteRole();
          }
          break;
        case "View All Departments":
          {
            viewAllDepartments();
          }
          break;
        case "View Department Budget":
          {
            viewDepartmentBudget();
          }
          break;
        case "Add Department":
          {
            addDepartment();
          }
          break;
        case "Delete Department":
          {
            deleteDepartment();
          }
          break;
        case "Exit":
          {
            db.end();
          }
          break;
      }
    });
};

const viewAllEmployees = () => {
  db.query(
    `SELECT employee.employee_id AS 'Employee ID',employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Position', name AS 'Department', role.salary AS 'Salary',  CONCAT(manager.first_name,' ',manager.last_name) AS 'Manager Name' FROM employee JOIN role using (role_id)  join department using (department_id)  left join employee as manager on employee.manager_id = manager.employee_id ORDER BY employee.employee_id ASC`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      questions();
    }
  );
};

const viewEmployeesByManager = () => {
  db.query(
    `SELECT * FROM employee WHERE manager_id IS NULL`,
    function (err, res) {
      if (err) throw err;
      let currentManager = res.map((manager) => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.employee_id,
      }));

      return inquirer
        .prompt({
          type: "list",
          name: "managerChoice",
          message: "Please choose a manager from the below options: ",
          choices: currentManager,
        })
        .then((response) => {
          db.query(
            `SELECT CONCAT(first_name,' ',last_name) AS 'Employee Name' FROM employee where manager_id =? `,
            response.managerChoice,
            function (err, res) {
              if (err) throw err;
              console.table(res);
            }
          );
          setTimeout(function () {
            questions();
          }, 1000);
        });
    }
  );
};

const updateEmployeeManager = () => {
  db.query(
    `SELECT * FROM employee WHERE manager_id IS NOT NULL`,
    function (err, res) {
      if (err) throw err;
      let currentEmployee = res.map((employeeName) => ({
        name: `${employeeName.first_name} ${employeeName.last_name}`,
        value: employeeName.employee_id,
      }));
      return inquirer
        .prompt({
          type: "list",
          name: "empName",
          message:
            "Please choose which employees manager you'd like to update: ",
          choices: currentEmployee,
        })
        .then((employeeManagerUpdate) => {
          db.query(
            `SELECT * FROM employee WHERE manager_id IS NULL`,
            function (err, res) {
              if (err) throw err;
              let currentManager = res.map((managerName) => ({
                name: `${managerName.first_name} ${managerName.last_name}`,
                value: managerName.employee_id,
              }));
              return inquirer
                .prompt({
                  type: "list",
                  name: "managerName",
                  message: "Please choose which employees new manager: ",
                  choices: currentManager,
                })
                .then((response) => {
                  db.query(
                    `UPDATE employee SET manager_id = ? WHERE employee_id = ?`,
                    [response.managerName, employeeManagerUpdate.empName],
                    function (err, res) {
                      if (err) throw err;
                      console.log(`Employees manager has been changes`);
                    }
                  );
                  setTimeout(function () {
                    questions();
                  }, 1000);
                });
            }
          );
        });
    }
  );
};

const addEmployee = () => {
  db.query(`SELECT * FROM role`, function (err, res) {
    if (err) throw err;
    let currentRoles = res.map((role) => ({
      name: role.title,
      value: role.role_id,
    }));
    db.query(
      `SELECT employee.employee_id AS 'Employee ID',employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Position', role.salary AS 'Salary',  CONCAT(manager.first_name,' ',manager.last_name) AS 'Manager Name' FROM employee JOIN role using (role_id)  left join employee as manager on employee.manager_id = manager.employee_id ORDER BY employee.employee_id ASC`,
      function (err, res) {
        if (err) throw err;

        console.table(res);
        return inquirer
          .prompt([
            {
              type: "input",
              name: "newEmployeeFirstName",
              message: "Please enter the new employes first name: ",
            },
            {
              type: "input",
              name: "newEmployeeLastName",
              message: "Please enter the new employes last name: ",
            },
            {
              type: "list",
              name: "newEmployeeRole",
              message:
                "Please choose the new employees role from the list below: ",
              choices: currentRoles,
            },
            {
              type: "input",
              name: "newEmployeeManager",
              message: "Please enter the Managers ID: ",
            },
          ])
          .then((response) => {
            db.query(
              `INSERT INTO employee SET ?`,
              {
                first_name: response.newEmployeeFirstName,
                last_name: response.newEmployeeLastName,
                role_id: response.newEmployeeRole,
                manager_id: response.newEmployeeManager,
              },
              function (err, res) {
                if (err) throw err;
                console.log(
                  `The employee ${response.newEmployeeFirstName} ${response.newEmployeeLastName} has been added.`
                );
                setTimeout(function () {
                  questions();
                }, 1000);
              }
            );
          });
      }
    );
  });
};

const updateEmplyoyeeRole = () => {
  db.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    let currentEmployee = res.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.employee_id,
    }));
    // console.log(currentEmployee);
    // console.table(res);
    return inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message:
            "Please select an employee whos role you'd like to change from the list below: ",
          choices: currentEmployee,
        },
      ])
      .then((userUpdateRoleChoice) => {
        db.query(`SELECT * FROM role`, function (err, res) {
          if (err) throw err;
          let currentRoles = res.map((role) => ({
            name: role.title,
            value: role.role_id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "roleChoice",
                message: "Please select a new role from the list below: ",
                choices: currentRoles,
              },
            ])
            .then((responses) => {
              db.query(
                "UPDATE employee SET role_id = ? WHERE employee_id = ?",
                [responses.roleChoice, userUpdateRoleChoice.employeeChoice],
                function (err, res) {
                  if (err) throw err;
                  console.log(`Employees role has been changed.`);
                }
              );
              setTimeout(function () {
                questions();
              }, 1000);
            });

          //   console.log(response);
          //   console.log(currentRoles);
          //   console.log(res);
        });
      });
  });
};

const viewAllRoles = () => {
  db.query(
    `SELECT role.role_id AS 'Role ID', role.title AS 'Position', salary AS 'Salary', department.name AS 'Department' FROM role JOIN department USING (department_id) ORDER BY department.department_id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      questions();
    }
  );
};

const addRole = () => {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    let currentDepartment = res.map((department) => ({
      name: department.name,
      value: department.department_id,
    }));
    db.query(
      `select department.department_id AS 'Department ID', name AS 'Department Name', role.role_id AS 'Role ID', role.title AS 'Position', role.salary AS Salary from department join role using (department_id)`,
      function (err, res) {
        if (err) throw err;
        //console.table(res);
        return inquirer
          .prompt([
            {
              name: "roleDepartment",
              message:
                "Please select a department to which the new role will belong to: ",
              choices: currentDepartment,
              type: "list",
            },
            {
              name: "newRoleTitle",
              message: "Please enter the title of the new role: ",
              type: "input",
            },
            {
              name: "newRoleSalary",
              message: "Please enter the salary of the new role:",
              type: "input",
            },
          ])
          .then((response) => {
            db.query(
              `INSERT INTO role SET ?`,
              {
                department_id: response.roleDepartment,
                title: response.newRoleTitle,
                salary: response.newRoleSalary,
              },
              function (err, res) {
                if (err) throw err;
                console.log(
                  `The role ${response.newRoleTitle} has been added.`
                );
                setTimeout(function () {
                  questions();
                }, 1000);
              }
            );
          });
      }
    );
  });
};

const viewAllDepartments = () => {
  db.query(
    `SELECT department_id AS 'Department ID', name AS 'Department Name' FROM department`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      questions();
    }
  );
};

const viewEmployeesByDepartment = () => {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    let currentDepartment = res.map((department) => ({
      name: department.name,
      value: department.department_id,
    }));

    return inquirer
      .prompt({
        type: "list",
        name: "departmentChoice",
        message: "Please choose a department from the below options: ",
        choices: currentDepartment,
      })
      .then((response) => {
        db.query(
          `SELECT CONCAT(first_name,' ',last_name) AS 'Employee Name' FROM employee Join role using (role_id) where department_id = ? `,
          response.departmentChoice,
          function (err, res) {
            if (err) throw err;
            console.table(res);
          }
        );
        setTimeout(function () {
          questions();
        }, 1000);
      });
  });
};

const viewDepartmentBudget = () => {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    let currentDepartment = res.map((department) => ({
      name: department.name,
      value: department.department_id,
    }));
    return inquirer
      .prompt({
        type: "list",
        name: "departmentChoice",
        message: "Please choose a department from the below options: ",
        choices: currentDepartment,
      })
      .then((response) => {
        db.query(
          `Select Sum(salary) from department join role using (department_id) where department.department_id = ? `,
          response.departmentChoice,
          function (err, res) {
            if (err) throw err;
            console.table(res);
          }
        );
        setTimeout(function () {
          questions();
        }, 1000);
      });
  });
};

const addDepartment = () => {
  return inquirer
    .prompt({
      type: "input",
      name: "addDep",
      message: "Please enter the name of the Department you would like to add.",
    })
    .then((response) => {
      let newDep = response.addDep;
      db.query(
        "INSERT INTO department (name) value (?)",
        newDep,
        function (err, result) {
          if (err) {
            throw err;
          }
          console.log(
            `The department ${response.addDep} has been successfully added`
          );
        }
      );
      setTimeout(function () {
        questions();
      }, 1000);
    });
};

const deleteDepartment = () => {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    console.log(
      `Please ensure that all constraints have been removed from this department (Roles and Employees)`
    );
    let deletedDepartment = res.map((delDepartment) => ({
      name: delDepartment.name,
      value: delDepartment.department_id,
    }));
    return inquirer
      .prompt({
        type: "list",
        name: "deletedDepartment",
        message: "Please select a department to delete: ",
        choices: deletedDepartment,
      })
      .then((response) => {
        db.query(
          `DELETE FROM department where department_id = ?`,
          response.deletedDepartment,
          function (err, res) {
            if (err) throw err;
            console.log(`Department Deleted`);
          }
        );
        setTimeout(function () {
          questions();
        }, 1000);
      });
  });
};

const deleteRole = () => {
  db.query(`SELECT * FROM role`, function (err, res) {
    if (err) throw err;
    console.log(
      `Please ensure that all constraints have been removed from this role (Departments and Employees)`
    );
    let deletedRole = res.map((deldRole) => ({
      name: deldRole.title,
      value: deldRole.role_id,
    }));
    return inquirer
      .prompt({
        type: "list",
        name: "deletedRole",
        message: "Please select a role to delete: ",
        choices: deletedRole,
      })
      .then((response) => {
        db.query(
          `DELETE FROM role where role_id = ?`,
          response.deletedRole,
          function (err, res) {
            if (err) throw err;
            console.log(`Role Deleted`);
          }
        );
        setTimeout(function () {
          questions();
        }, 1000);
      });
  });
};

const deleteEmployee = () => {
  db.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    console.log(
      `Please ensure that all constraints have been removed from this Employee (Roles and Department)`
    );
    let deletedEmployee = res.map((delEmp) => ({
      name: `${delEmp.first_name} ${delEmp.last_name}`,
      value: delEmp.employee_id,
    }));
    return inquirer
      .prompt({
        type: "list",
        name: "deletedEmployee",
        message: "Please select an employee to delete: ",
        choices: deletedEmployee,
      })
      .then((response) => {
        // console.log(response);
        db.query(
          `DELETE FROM employee where employee_id = ?`,
          [response.deletedEmployee],
          function (err, res) {
            if (err) throw err;
            console.log(`Employee Deleted`);
          }
        );
        setTimeout(function () {
          questions();
        }, 1000);
      });
  });
};
