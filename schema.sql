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

SELECT * FROM managers;
SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM departments;


SELECT roles.title, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id=departments.id;
SELECT employees.id, managers.manager FROM employees LEFT JOIN managers ON employees.manager_id=managers.id;

