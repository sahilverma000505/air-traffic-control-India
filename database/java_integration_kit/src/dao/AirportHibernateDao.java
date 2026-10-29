package dao;

import entity.Airport;
import entity.AirwayRoute;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import util.HibernateUtil;

import java.util.List;

/**
 * Hibernate ORM Data Access Object (DAO).
 * Demonstrates Session, Transaction, HQL (Hibernate Query Language), and entity persistence.
 */
public class AirportHibernateDao {

    /**
     * Retrieve all airports using HQL.
     */
    public List<Airport> getAllAirports() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Airport> query = session.createQuery("FROM Airport ORDER BY code ASC", Airport.class);
            return query.list();
        }
    }

    /**
     * Retrieve all active airway routes.
     */
    public List<AirwayRoute> getActiveRoutes() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<AirwayRoute> query = session.createQuery(
                "FROM AirwayRoute WHERE isActive = 1 ORDER BY distanceKm ASC", AirwayRoute.class
            );
            return query.list();
        }
    }

    /**
     * Save or update an Airport using Hibernate Transaction.
     */
    public void saveAirport(Airport airport) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.persist(airport);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw e;
        }
    }

    // Quick test runner for college lab
    public static void main(String[] args) {
        AirportHibernateDao dao = new AirportHibernateDao();
        System.out.println("--- Testing Hibernate ORM Connectivity ---");
        try {
            List<Airport> list = dao.getAllAirports();
            System.out.println("Found " + list.size() + " airports mapped by Hibernate ORM:");
            list.stream().limit(5).forEach(a -> System.out.println("  * " + a));
        } catch (Exception e) {
            System.err.println("Hibernate operation failed: " + e.getMessage());
            e.printStackTrace();
        } finally {
            HibernateUtil.shutdown();
        }
    }
}
