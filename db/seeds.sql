INSERT INTO department (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id) VALUES 
('HR Manager', 75000, 1),
('Software Engineer', 90000, 2),
('Sales Representative', 60000, 3),
('Financial Analyst', 70000, 4),
('Legal Advisor', 80000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Darren', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Rob', 'Townsend', 4, NULL),
('Emma', 'Davids', 5, NULL),
('Michael', 'Clark', 2, 2),
('Jessica', 'Marlot', 3, NULL),
('Sarah', 'Wilson', 3, 6);