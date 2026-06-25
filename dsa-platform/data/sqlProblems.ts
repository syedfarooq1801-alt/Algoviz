export type SQLCategory =
  | "Basic Queries"
  | "Joins"
  | "Aggregations"
  | "Window Functions"
  | "CTEs"
  | "Advanced";

export interface SQLSchema {
  name: string;
  columns: string[];
  sample: string[][];
}

export interface SQLProblem {
  id: string;
  title: string;
  category: SQLCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  schemas: SQLSchema[];
  hint?: string;
  solution: string;
  explanation: string[];
  companies: string[];
  tags: string[];
}

export const SQL_PROBLEMS: SQLProblem[] = [
  // ── BASIC QUERIES ──────────────────────────────────────────────
  {
    id: "second-highest-salary",
    title: "Second Highest Salary",
    category: "Basic Queries",
    difficulty: "Easy",
    description: "Write a SQL query to get the second highest salary from the Employee table. Return NULL if no second highest salary exists.",
    schemas: [
      {
        name: "Employee",
        columns: ["Id (INT)", "Salary (INT)"],
        sample: [["1", "100"], ["2", "200"], ["3", "300"]],
      },
    ],
    hint: "Use OFFSET 1 LIMIT 1 or a subquery with MAX excluding the maximum.",
    solution: `-- Approach 1: OFFSET / LIMIT
SELECT (
    SELECT DISTINCT Salary
    FROM Employee
    ORDER BY Salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;

-- Approach 2: Subquery excluding MAX
SELECT MAX(Salary) AS SecondHighestSalary
FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);`,
    explanation: [
      "LIMIT 1 OFFSET 1 skips the highest salary and takes the next distinct one.",
      "Wrapping in SELECT ensures NULL is returned (not empty row) when no second salary exists.",
      "WHERE Salary < MAX approach is portable across MySQL, PostgreSQL, SQL Server.",
    ],
    companies: ["Meta", "Amazon", "Adobe"],
    tags: ["subquery", "aggregation", "NULL handling"],
  },
  {
    id: "duplicate-emails",
    title: "Find Duplicate Emails",
    category: "Basic Queries",
    difficulty: "Easy",
    description: "Find all emails that appear more than once in the Person table.",
    schemas: [
      {
        name: "Person",
        columns: ["Id (INT)", "Email (VARCHAR)"],
        sample: [["1", "a@b.com"], ["2", "c@d.com"], ["3", "a@b.com"]],
      },
    ],
    solution: `SELECT Email
FROM Person
GROUP BY Email
HAVING COUNT(*) > 1;`,
    explanation: [
      "GROUP BY Email collapses rows with the same email.",
      "HAVING filters groups — WHERE cannot filter on aggregate functions.",
      "COUNT(*) > 1 means the email appeared more than once.",
    ],
    companies: ["Apple", "Lyft"],
    tags: ["GROUP BY", "HAVING"],
  },
  {
    id: "customers-never-ordered",
    title: "Customers Who Never Ordered",
    category: "Basic Queries",
    difficulty: "Easy",
    description: "Find all customers who never placed an order.",
    schemas: [
      {
        name: "Customers",
        columns: ["Id (INT)", "Name (VARCHAR)"],
        sample: [["1", "Alice"], ["2", "Bob"], ["3", "Charlie"]],
      },
      {
        name: "Orders",
        columns: ["Id (INT)", "CustomerId (INT)"],
        sample: [["1", "3"], ["2", "1"]],
      },
    ],
    solution: `-- Approach 1: LEFT JOIN + NULL check
SELECT c.Name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.Id = o.CustomerId
WHERE o.Id IS NULL;

-- Approach 2: NOT IN subquery
SELECT Name AS Customers
FROM Customers
WHERE Id NOT IN (SELECT CustomerId FROM Orders);

-- Approach 3: NOT EXISTS (best for large tables)
SELECT Name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.CustomerId = c.Id
);`,
    explanation: [
      "LEFT JOIN keeps all customers, NULLs where no matching order.",
      "NOT IN fails silently if subquery returns NULLs — use NOT EXISTS for safety.",
      "NOT EXISTS often best performance — stops scanning on first match.",
    ],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    tags: ["LEFT JOIN", "NOT EXISTS", "NULL"],
  },

  // ── JOINS ──────────────────────────────────────────────────────
  {
    id: "employees-managers",
    title: "Employees Earning More Than Manager",
    category: "Joins",
    difficulty: "Easy",
    description: "Find employees who earn more than their manager. The Employee table has a ManagerId that is a self-referential foreign key.",
    schemas: [
      {
        name: "Employee",
        columns: ["Id (INT)", "Name (VARCHAR)", "Salary (INT)", "ManagerId (INT)"],
        sample: [["1", "Joe", "70000", "3"], ["2", "Henry", "80000", "4"], ["3", "Sam", "60000", "NULL"], ["4", "Max", "90000", "NULL"]],
      },
    ],
    solution: `-- Self-join approach
SELECT e1.Name AS Employee
FROM Employee e1
JOIN Employee e2 ON e1.ManagerId = e2.Id
WHERE e1.Salary > e2.Salary;`,
    explanation: [
      "Self-join: alias Employee as e1 (employees) and e2 (managers).",
      "Join condition: employee's ManagerId = manager's Id.",
      "WHERE clause filters only those employees earning more than their manager.",
      "INNER JOIN automatically excludes employees with NULL ManagerId (no manager).",
    ],
    companies: ["Meta", "Amazon"],
    tags: ["self join", "JOIN"],
  },
  {
    id: "department-highest-salary",
    title: "Department Highest Salary",
    category: "Joins",
    difficulty: "Medium",
    description: "Find employees who have the highest salary in each department.",
    schemas: [
      {
        name: "Employee",
        columns: ["Id (INT)", "Name (VARCHAR)", "Salary (INT)", "DepartmentId (INT)"],
        sample: [["1", "Joe", "70000", "1"], ["2", "Jim", "90000", "1"], ["3", "Henry", "80000", "2"]],
      },
      {
        name: "Department",
        columns: ["Id (INT)", "Name (VARCHAR)"],
        sample: [["1", "IT"], ["2", "Sales"]],
      },
    ],
    solution: `-- Approach 1: Subquery with GROUP BY
SELECT d.Name AS Department, e.Name AS Employee, e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
WHERE (e.DepartmentId, e.Salary) IN (
    SELECT DepartmentId, MAX(Salary)
    FROM Employee
    GROUP BY DepartmentId
);

-- Approach 2: Window function (cleaner)
WITH ranked AS (
    SELECT Name, Salary, DepartmentId,
           RANK() OVER (PARTITION BY DepartmentId ORDER BY Salary DESC) AS rnk
    FROM Employee
)
SELECT d.Name AS Department, r.Name AS Employee, r.Salary
FROM ranked r
JOIN Department d ON r.DepartmentId = d.Id
WHERE r.rnk = 1;`,
    explanation: [
      "Row subquery (DepartmentId, Salary) IN (...) filters to max salary per dept.",
      "Window function RANK() PARTITION BY dept — handles ties naturally.",
      "RANK() gives same rank to ties. ROW_NUMBER() would pick arbitrary winner among ties.",
    ],
    companies: ["Meta", "Microsoft", "Stripe"],
    tags: ["JOIN", "GROUP BY", "window function", "RANK"],
  },

  // ── AGGREGATIONS ───────────────────────────────────────────────
  {
    id: "rising-temperature",
    title: "Rising Temperature",
    category: "Aggregations",
    difficulty: "Easy",
    description: "Find all dates with higher temperatures compared to the previous day.",
    schemas: [
      {
        name: "Weather",
        columns: ["Id (INT)", "RecordDate (DATE)", "Temperature (INT)"],
        sample: [["1", "2015-01-01", "10"], ["2", "2015-01-02", "25"], ["3", "2015-01-03", "20"]],
      },
    ],
    solution: `-- Approach 1: Self-join on date arithmetic
SELECT w2.Id
FROM Weather w1
JOIN Weather w2 ON DATEDIFF(w2.RecordDate, w1.RecordDate) = 1
WHERE w2.Temperature > w1.Temperature;

-- Approach 2: LAG window function (more readable)
SELECT Id FROM (
    SELECT Id,
           Temperature,
           LAG(Temperature) OVER (ORDER BY RecordDate) AS prev_temp,
           LAG(RecordDate) OVER (ORDER BY RecordDate) AS prev_date,
           RecordDate
    FROM Weather
) t
WHERE Temperature > prev_temp
  AND DATEDIFF(RecordDate, prev_date) = 1;`,
    explanation: [
      "Self-join on DATEDIFF = 1 pairs each row with the previous day.",
      "LAG(col) OVER (ORDER BY date) returns previous row's value — cleaner than self-join.",
      "DATEDIFF check important: gaps in data (missing days) shouldn't count as consecutive.",
    ],
    companies: ["Uber", "Oracle"],
    tags: ["self join", "LAG", "date arithmetic"],
  },
  {
    id: "game-play-analysis",
    title: "Game Play Analysis — First Login",
    category: "Aggregations",
    difficulty: "Easy",
    description: "Report the first login date for each player.",
    schemas: [
      {
        name: "Activity",
        columns: ["player_id (INT)", "device_id (INT)", "event_date (DATE)", "games_played (INT)"],
        sample: [["1", "2", "2016-03-01", "5"], ["1", "2", "2016-05-02", "6"], ["2", "3", "2017-06-25", "1"]],
      },
    ],
    solution: `SELECT player_id, MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;`,
    explanation: [
      "MIN(event_date) per player — earliest date is the first login.",
      "GROUP BY player_id collapses all sessions per player.",
    ],
    companies: ["Google"],
    tags: ["GROUP BY", "MIN"],
  },

  // ── WINDOW FUNCTIONS ───────────────────────────────────────────
  {
    id: "rank-scores",
    title: "Rank Scores",
    category: "Window Functions",
    difficulty: "Medium",
    description: "Rank scores in descending order. Ties get same rank, no gaps in ranking (dense rank). Return score and rank columns.",
    schemas: [
      {
        name: "Scores",
        columns: ["Id (INT)", "Score (DECIMAL)"],
        sample: [["1", "3.50"], ["2", "3.65"], ["3", "4.00"], ["4", "3.85"], ["5", "4.00"], ["6", "3.65"]],
      },
    ],
    solution: `SELECT Score,
       DENSE_RANK() OVER (ORDER BY Score DESC) AS 'Rank'
FROM Scores
ORDER BY Score DESC;`,
    explanation: [
      "DENSE_RANK(): ties get same rank, next rank is consecutive (no gaps). 1,1,2,3...",
      "RANK(): ties get same rank, but next rank skips. 1,1,3,4...",
      "ROW_NUMBER(): no ties allowed, arbitrary tiebreak. 1,2,3,4...",
      "ORDER BY Score DESC gives highest score rank 1.",
    ],
    companies: ["Meta", "Google", "Bloomberg"],
    tags: ["DENSE_RANK", "RANK", "ROW_NUMBER", "window function"],
  },
  {
    id: "nth-highest-salary",
    title: "Nth Highest Salary",
    category: "Window Functions",
    difficulty: "Medium",
    description: "Write a function/query to get the Nth highest salary. Return NULL if not enough distinct salaries.",
    schemas: [
      {
        name: "Employee",
        columns: ["Id (INT)", "Salary (INT)"],
        sample: [["1", "100"], ["2", "200"], ["3", "300"]],
      },
    ],
    solution: `-- MySQL stored function
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  SET N = N - 1;
  RETURN (
      SELECT DISTINCT Salary
      FROM Employee
      ORDER BY Salary DESC
      LIMIT 1 OFFSET N
  );
END;

-- Pure SQL with window function
WITH ranked AS (
    SELECT DISTINCT Salary,
           DENSE_RANK() OVER (ORDER BY Salary DESC) AS rnk
    FROM Employee
)
SELECT Salary FROM ranked WHERE rnk = N;`,
    explanation: [
      "LIMIT 1 OFFSET N-1 skips N-1 rows and takes the next.",
      "DISTINCT ensures we count unique salaries, not duplicate salary rows.",
      "DENSE_RANK approach is cleaner and handles ties correctly.",
    ],
    companies: ["Meta", "Amazon", "Microsoft"],
    tags: ["OFFSET", "DENSE_RANK", "stored function"],
  },
  {
    id: "consecutive-numbers",
    title: "Consecutive Numbers",
    category: "Window Functions",
    difficulty: "Medium",
    description: "Find all numbers that appear at least three times consecutively in the Logs table.",
    schemas: [
      {
        name: "Logs",
        columns: ["Id (INT, auto-increment)", "Num (INT)"],
        sample: [["1", "1"], ["2", "1"], ["3", "1"], ["4", "2"], ["5", "1"], ["6", "2"], ["7", "2"]],
      },
    ],
    solution: `-- Approach 1: Self-join on consecutive IDs
SELECT DISTINCT l1.Num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.Id = l1.Id + 1 AND l2.Num = l1.Num
JOIN Logs l3 ON l3.Id = l1.Id + 2 AND l3.Num = l1.Num;

-- Approach 2: LAG/LEAD window functions
SELECT DISTINCT Num AS ConsecutiveNums
FROM (
    SELECT Num,
           LAG(Num, 1) OVER (ORDER BY Id) AS prev1,
           LAG(Num, 2) OVER (ORDER BY Id) AS prev2
    FROM Logs
) t
WHERE Num = prev1 AND Num = prev2;`,
    explanation: [
      "Self-join on Id+1 and Id+2 finds three consecutive rows.",
      "LAG(Num, 2) returns the value from 2 rows before — more expressive for N-consecutive.",
      "DISTINCT removes duplicates when the number appears consecutively multiple times.",
      "Assumes Id is sequential with no gaps — real data may need ROW_NUMBER() first.",
    ],
    companies: ["Airbnb", "Stripe", "Shopify"],
    tags: ["self join", "LAG", "LEAD", "consecutive"],
  },
  {
    id: "median-employee-salary",
    title: "Running Total and Moving Average",
    category: "Window Functions",
    difficulty: "Hard",
    description: "For each day in the Stadium table, compute the running total of visitors and 3-day moving average. Also find rows where 3 consecutive days all have >= 100 visitors.",
    schemas: [
      {
        name: "Stadium",
        columns: ["id (INT)", "visit_date (DATE)", "people (INT)"],
        sample: [["1", "2017-01-01", "10"], ["2", "2017-01-02", "109"], ["3", "2017-01-03", "150"], ["4", "2017-01-04", "99"], ["5", "2017-01-05", "145"]],
      },
    ],
    solution: `-- Running total + 3-day moving average
SELECT id, visit_date, people,
    SUM(people) OVER (ORDER BY visit_date
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
    AVG(people) OVER (ORDER BY visit_date
                      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3day
FROM Stadium;

-- Find 3+ consecutive days with >= 100 visitors
SELECT DISTINCT s1.id, s1.visit_date, s1.people
FROM Stadium s1
JOIN Stadium s2 ON ABS(s1.id - s2.id) <= 2 AND s2.people >= 100
JOIN Stadium s3 ON ABS(s1.id - s3.id) <= 2 AND s3.people >= 100
WHERE s1.people >= 100
  AND s2.id != s3.id AND s1.id != s2.id AND s1.id != s3.id
ORDER BY s1.visit_date;`,
    explanation: [
      "SUM() OVER (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) = cumulative sum.",
      "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW = sliding window of last 3 rows.",
      "RANGE BETWEEN uses value-based bounds; ROWS uses physical row count.",
      "For consecutive days: join on |id difference| <= 2 to find triplets.",
    ],
    companies: ["Google", "Amazon", "Microsoft", "Stripe"],
    tags: ["SUM OVER", "AVG OVER", "ROWS BETWEEN", "moving average", "cumulative"],
  },

  // ── CTEs ───────────────────────────────────────────────────────
  {
    id: "employee-bonus",
    title: "Department vs Company Salary Comparison",
    category: "CTEs",
    difficulty: "Hard",
    description: "Compare each department's average salary to the company average for each month. Return departments earning above company average.",
    schemas: [
      {
        name: "salary",
        columns: ["id (INT)", "employee_id (INT)", "amount (INT)", "pay_date (DATE)"],
        sample: [["1", "1", "9000", "2017-03-31"], ["2", "2", "6000", "2017-03-31"], ["3", "3", "10000", "2017-02-28"]],
      },
      {
        name: "employee",
        columns: ["employee_id (INT)", "department_id (INT)"],
        sample: [["1", "1"], ["2", "2"], ["3", "2"]],
      },
    ],
    solution: `WITH company_avg AS (
    SELECT DATE_FORMAT(pay_date, '%Y-%m') AS pay_month,
           AVG(amount) AS company_avg_salary
    FROM salary
    GROUP BY pay_month
),
dept_avg AS (
    SELECT DATE_FORMAT(s.pay_date, '%Y-%m') AS pay_month,
           e.department_id,
           AVG(s.amount) AS dept_avg_salary
    FROM salary s
    JOIN employee e ON s.employee_id = e.employee_id
    GROUP BY pay_month, e.department_id
)
SELECT d.pay_month, d.department_id,
    CASE WHEN d.dept_avg_salary > c.company_avg_salary THEN 'higher'
         WHEN d.dept_avg_salary < c.company_avg_salary THEN 'lower'
         ELSE 'same' END AS comparison
FROM dept_avg d
JOIN company_avg c ON d.pay_month = c.pay_month
ORDER BY d.pay_month DESC, d.department_id;`,
    explanation: [
      "CTE company_avg: company-wide monthly average.",
      "CTE dept_avg: per-department per-month average.",
      "JOIN on pay_month to align both averages for the same time period.",
      "CASE WHEN for categorical output — higher/lower/same.",
      "DATE_FORMAT('%Y-%m') extracts year-month for grouping.",
    ],
    companies: ["Meta", "Stripe", "Coinbase"],
    tags: ["CTE", "WITH", "AVG", "DATE_FORMAT", "CASE WHEN"],
  },
  {
    id: "recursive-cte-org",
    title: "Recursive CTE — Org Hierarchy",
    category: "CTEs",
    difficulty: "Hard",
    description: "Given an Employee table with manager_id, find all subordinates of a given manager at any depth (transitive closure of the reporting chain). Output each employee and their depth level.",
    schemas: [
      {
        name: "Employee",
        columns: ["id (INT)", "name (VARCHAR)", "manager_id (INT, nullable)"],
        sample: [["1", "CEO", "NULL"], ["2", "VP1", "1"], ["3", "VP2", "1"], ["4", "Mgr1", "2"], ["5", "Dev1", "4"]],
      },
    ],
    solution: `WITH RECURSIVE subordinates AS (
    -- Base case: the target manager
    SELECT id, name, manager_id, 0 AS depth
    FROM Employee
    WHERE id = 1  -- starting manager id

    UNION ALL

    -- Recursive case: find employees reporting to anyone in the CTE
    SELECT e.id, e.name, e.manager_id, s.depth + 1
    FROM Employee e
    JOIN subordinates s ON e.manager_id = s.id
)
SELECT id, name, depth
FROM subordinates
WHERE id != 1  -- exclude the root manager themselves
ORDER BY depth, id;`,
    explanation: [
      "WITH RECURSIVE defines a CTE that can reference itself.",
      "Base case: anchor row (the starting manager at depth 0).",
      "Recursive case: join employees to CTE on manager_id = CTE.id — one level deeper each iteration.",
      "UNION ALL (not UNION) — never expect duplicates in org trees, UNION would be slow.",
      "MySQL/PostgreSQL/SQL Server all support WITH RECURSIVE. Oracle uses CONNECT BY.",
    ],
    companies: ["Google", "LinkedIn", "Salesforce"],
    tags: ["recursive CTE", "WITH RECURSIVE", "tree traversal", "hierarchy"],
  },

  // ── ADVANCED ───────────────────────────────────────────────────
  {
    id: "trips-users-cancellation",
    title: "Trips and Users — Cancellation Rate",
    category: "Advanced",
    difficulty: "Hard",
    description: "Find the cancellation rate of requests made by unbanned users between 2013-10-01 and 2013-10-03. Round to 2 decimal places.",
    schemas: [
      {
        name: "Trips",
        columns: ["Id (INT)", "Client_Id (INT)", "Driver_Id (INT)", "City_Id (INT)", "Status (ENUM)", "Request_at (DATE)"],
        sample: [["1", "1", "10", "1", "completed", "2013-10-01"], ["2", "2", "11", "1", "cancelled_by_driver", "2013-10-01"]],
      },
      {
        name: "Users",
        columns: ["Users_Id (INT)", "Banned (ENUM 'Yes'/'No')", "Role (ENUM 'client'/'driver'/'partner')"],
        sample: [["1", "No", "client"], ["2", "Yes", "client"], ["10", "No", "driver"], ["11", "No", "driver"]],
      },
    ],
    solution: `SELECT t.Request_at AS Day,
       ROUND(
           SUM(CASE WHEN t.Status != 'completed' THEN 1 ELSE 0 END)
           / COUNT(*),
           2
       ) AS 'Cancellation Rate'
FROM Trips t
JOIN Users u_client ON t.Client_Id = u_client.Users_Id AND u_client.Banned = 'No'
JOIN Users u_driver ON t.Driver_Id = u_driver.Users_Id AND u_driver.Banned = 'No'
WHERE t.Request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.Request_at
ORDER BY t.Request_at;`,
    explanation: [
      "JOIN on Banned = 'No' filters out banned users — both client and driver must be unbanned.",
      "CASE WHEN Status != 'completed' counts cancellations.",
      "SUM(cancellations) / COUNT(*) = cancellation rate per day.",
      "ROUND(..., 2) for 2 decimal places.",
      "GROUP BY Request_at gives per-day breakdown.",
    ],
    companies: ["Uber", "Lyft", "DiDi"],
    tags: ["JOIN", "CASE WHEN", "ROUND", "date filter", "rate calculation"],
  },
  {
    id: "median-salary",
    title: "Find Median Without PERCENTILE_CONT",
    category: "Advanced",
    difficulty: "Hard",
    description: "Find the median salary in the Employee table without using PERCENTILE_CONT (not available in MySQL). Handle both odd and even counts.",
    schemas: [
      {
        name: "Employee",
        columns: ["Id (INT)", "Salary (INT)"],
        sample: [["1", "100"], ["2", "200"], ["3", "300"], ["4", "400"]],
      },
    ],
    solution: `-- MySQL compatible median
SELECT AVG(Salary) AS Median
FROM (
    SELECT Salary,
           ROW_NUMBER() OVER (ORDER BY Salary) AS rn,
           COUNT(*) OVER () AS total
    FROM Employee
) t
WHERE rn IN (FLOOR((total + 1) / 2), CEIL((total + 1) / 2));

-- PostgreSQL: built-in
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Salary) AS Median
FROM Employee;`,
    explanation: [
      "ROW_NUMBER() assigns sequential ranks. COUNT(*) OVER() = total rows.",
      "For N rows: median position = (N+1)/2. Even N: average positions N/2 and N/2+1.",
      "FLOOR and CEIL handle both odd (same position) and even (two middle positions) cases.",
      "PostgreSQL's PERCENTILE_CONT(0.5) is the clean way — interpolates for even counts.",
    ],
    companies: ["Stripe", "Snowflake", "Databricks"],
    tags: ["ROW_NUMBER", "median", "PERCENTILE_CONT", "even/odd"],
  },
  {
    id: "pivot-table",
    title: "Dynamic Pivot — Monthly Revenue",
    category: "Advanced",
    difficulty: "Hard",
    description: "Pivot the Orders table to show total revenue per product per month as columns (Jan, Feb, Mar). Each product is a row, each month is a column.",
    schemas: [
      {
        name: "Orders",
        columns: ["order_id (INT)", "product (VARCHAR)", "month (INT)", "revenue (INT)"],
        sample: [["1", "A", "1", "100"], ["2", "A", "2", "200"], ["3", "B", "1", "300"], ["4", "B", "3", "150"]],
      },
    ],
    solution: `-- MySQL static pivot with CASE WHEN
SELECT product,
    SUM(CASE WHEN month = 1 THEN revenue ELSE 0 END) AS Jan,
    SUM(CASE WHEN month = 2 THEN revenue ELSE 0 END) AS Feb,
    SUM(CASE WHEN month = 3 THEN revenue ELSE 0 END) AS Mar
FROM Orders
GROUP BY product;

-- PostgreSQL with crosstab (requires tablefunc extension)
SELECT * FROM crosstab(
    'SELECT product, month, revenue FROM Orders ORDER BY 1,2',
    'SELECT DISTINCT month FROM Orders ORDER BY 1'
) AS pivot(product TEXT, jan INT, feb INT, mar INT);`,
    explanation: [
      "CASE WHEN inside SUM: conditional aggregation — the core pivot technique.",
      "Each month column = SUM of revenue for that month, 0 elsewhere.",
      "GROUP BY product collapses all months into one row per product.",
      "PostgreSQL crosstab() is cleaner but requires knowing column list upfront.",
      "For dynamic columns (unknown months): must build SQL dynamically in application code.",
    ],
    companies: ["Meta", "Stripe", "Snowflake", "Databricks"],
    tags: ["pivot", "CASE WHEN", "conditional aggregation", "crosstab"],
  },
];

export const SQL_CATEGORIES: SQLCategory[] = [
  "Basic Queries",
  "Joins",
  "Aggregations",
  "Window Functions",
  "CTEs",
  "Advanced",
];

export function getSQLProblem(id: string): SQLProblem | undefined {
  return SQL_PROBLEMS.find((p) => p.id === id);
}

export function getSQLByCategory(cat: SQLCategory): SQLProblem[] {
  return SQL_PROBLEMS.filter((p) => p.category === cat);
}
