-- insert employees into employee table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Richards", 55, 3);

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

-- insert departments into department table
INSERT INTO departments (name)
VALUES ("Sales"), ("Software Engineering"), ("Finance"), ("Legal");
