DROP DATABASE IF EXISTS employees_DB;
CREATE database employees_DB;

USE employees_DB;

CREATE TABLE managers (
  id INT AUTO_INCREMENT NOT NULL,
  manager VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(6, 0) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);


INSERT INTO managers (manager)
VALUES ("Ron Murgundy"), ("Anna DeMamp"), ("Lawrence Ho"), ("Juliana Reyes");

INSERT INTO departments (name)
VALUES ("Sales"), ("Software Engineering"), ("Finance"), ("Legal");

-- insert Sales roles into role table
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1);

-- insert Software Engineer roles into role table
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2);

-- insert Finance roles into role table
INSERT INTO roles (title, salary, department_id)
VALUES ("Account Manager", 160000, 3), ("Accountant", 125000, 3);

-- insert Legal roles into role table
INSERT INTO roles (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4),("Lawyer", 190000, 4);

SELECT * FROM managers;
SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM departments;

UPDATE employees SET role_id = 7 WHERE id = 3;

SELECT roles.title, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id=departments.id;
SELECT employees.id, managers.manager FROM employees LEFT JOIN managers ON employees.manager_id=managers.id;

