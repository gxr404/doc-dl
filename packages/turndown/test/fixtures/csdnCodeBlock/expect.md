```sql
EXPLAIN
  SELECT e.first_name,e.last_name,e.salary,d.department_name
    FROM employees e
    JOIN departments d ON (e.department_id = d.department_id)
   WHERE e.salary > 15000;
  
```

```sql
SELECT * FROM TABLE(DBMS_XPLAN.display);
    PLAN_TABLE_OUTPUT                                                                           |
    --------------------------------------------------------------------------------------------|
    Plan hash value: 1343509718                                                                 |
                                                                                                |
    --------------------------------------------------------------------------------------------|
    | Id  | Operation                    | Name        | Rows  | Bytes | Cost (%CPU)| Time     ||
    --------------------------------------------------------------------------------------------|
    |   0 | SELECT STATEMENT             |             |    44 |  1672 |     6  (17)| 00:00:01 ||
    |   1 |  MERGE JOIN                  |             |    44 |  1672 |     6  (17)| 00:00:01 ||
    |   2 |   TABLE ACCESS BY INDEX ROWID| DEPARTMENTS |    27 |   432 |     2   (0)| 00:00:01 ||
    |   3 |    INDEX FULL SCAN           | DEPT_ID_PK  |    27 |       |     1   (0)| 00:00:01 ||
    |*  4 |   SORT JOIN                  |             |    44 |   968 |     4  (25)| 00:00:01 ||
    |*  5 |    TABLE ACCESS FULL         | EMPLOYEES   |    44 |   968 |     3   (0)| 00:00:01 ||
    --------------------------------------------------------------------------------------------|
                                                                                                |
    Predicate Information (identified by operation id):                                         |
    ---------------------------------------------------                                         |
                                                                                                |
       4 - access("E"."DEPARTMENT_ID"="D"."DEPARTMENT_ID")                                      |
           filter("E"."DEPARTMENT_ID"="D"."DEPARTMENT_ID")                                      |
       5 - filter("E"."SALARY">15000)                                                           |
    
```

```java
IndexResponse response = client.prepareIndex("twitter", "_doc", "1")
      .setSource(jsonBuilder()
                  .startObject()
                      .field("user", "kimchy")
                      .field("postDate", new Date())
                      .field("message", "trying out Elasticsearch")
                  .endObject()
                )
      .get();

```