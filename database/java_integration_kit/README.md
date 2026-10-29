# Java, JDBC & Hibernate Integration Guide
## Air Traffic Control of India - DAA & DBMS Lab Integration

This kit provides the Java classes, JDBC Data Access Objects (DAOs), and Hibernate ORM entities matching the **Air Traffic Control of India** database schema.

---

## 1. Architecture Overview

```
                 +-----------------------------------------+
                 |       HTML5 / CSS3 / JS Frontend        |
                 |      (Interactive Radar Simulator)      |
                 +--------------------+--------------------+
                                      | HTTP REST / JSON
                                      v
                 +--------------------+--------------------+
                 |   Python REST API (server.py)           |
                 |      OR Java Spring / Servlet           |
                 +--------------------+--------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v (Direct SQL)                                            v (ORM Mapping)
+-----------------------+                                 +-----------------------+
|     AirportJdbcDao    |                                 |   AirportHibernateDao |
|  - Connection         |                                 |  - SessionFactory     |
|  - PreparedStatement  |                                 |  - Session / HQL      |
|  - ResultSet          |                                 |  - @Entity POJOs      |
+-----------+-----------+                                 +-----------+-----------+
            \                                                     /
             \                                                   /
              +-------------------+-----------------------------+
                                  |
                                  v
                    +---------------------------+
                    | SQLite / MySQL / Postgres |
                    |      airtraffic.db        |
                    +---------------------------+
```

---

## 2. Setting Up in Eclipse, IntelliJ, or VS Code

### Option A: Using Maven (Recommended)
1. Open Eclipse or IntelliJ IDEA.
2. Choose **File > Open / Import Project > Existing Maven Project**.
3. Select this folder (`database/java_integration_kit`).
4. Maven will automatically download:
   - `mysql-connector-j` (for MySQL)
   - `sqlite-jdbc` (for SQLite)
   - `hibernate-core` (Hibernate 6.x)

### Option B: Using Plain Java Project (Manual JARs)
If you are doing this in your college lab without Maven:
1. Create a new Java Project.
2. Right click project > **Build Path > Configure Build Path > Add External JARs**.
3. Add:
   - `sqlite-jdbc-3.45.x.jar` (or `mysql-connector-j-8.x.jar`)
   - Hibernate required jars: `hibernate-core`, `jakarta.persistence-api`.

---

## 3. Database Connection Configuration

### Connecting to the included SQLite database:
In `DbConnectionUtil.java` or `hibernate.cfg.xml`:
```java
String url = "jdbc:sqlite:../database/airtraffic.db";
```

### Switching to MySQL (e.g. XAMPP / WampServer):
1. Run `database/schema.sql` and `database/seed_data.sql` in phpMyAdmin or MySQL Workbench.
2. In `DbConnectionUtil.java`:
```java
String url = "jdbc:mysql://localhost:3306/airtraffic?useSSL=false";
String user = "root";
String password = "";
```

---

## 4. Code Examples

### A. Pure JDBC Example (`AirportJdbcDao.java`):
```java
Connection conn = DbConnectionUtil.getConnection();
PreparedStatement ps = conn.prepareStatement("SELECT * FROM airports WHERE code = ?");
ps.setString(1, "DEL");
ResultSet rs = ps.executeQuery();
while (rs.next()) {
    System.out.println("Airport: " + rs.getString("name") + " (" + rs.getString("city") + ")");
}
```

### B. Hibernate ORM Example (`AirportHibernateDao.java`):
```java
Session session = HibernateUtil.getSessionFactory().openSession();
List<Airport> airports = session.createQuery("FROM Airport WHERE runways > 1", Airport.class).list();
for (Airport a : airports) {
    System.out.println(a.getCode() + " - " + a.getName());
}
session.close();
```

---

## 5. DAA Graph Connection
In Java, you can implement Prim's algorithm using the Java Collections `PriorityQueue<Edge>` and `HashMap<String, List<Edge>>`. The `AirportJdbcDao` and `AirportHibernateDao` provide methods to read vertices and edges directly into your Java Prim's solver!
