import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class DataSeeder {
    public static void main(String[] args) throws SQLException {
        String url = "jdbc:postgresql://localhost:5432/benchmark";
        String user = "benchmark";
        String password = "benchmark123";
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to database");
            
            // Seed categories
            seedCategories(conn);
            
            // Seed items
            seedItems(conn);
            
            System.out.println("Seeding complete!");
        }
    }
    
    static void seedCategories(Connection conn) throws SQLException {
        String sql = "INSERT INTO category (code, name, updated_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (int i = 1; i <= 2000; i++) {
                stmt.setString(1, String.format("CAT%04d", i));
                stmt.setString(2, "Category " + i);
                stmt.setObject(3, LocalDateTime.now());
                stmt.addBatch();
                
                if (i % 100 == 0) {
                    stmt.executeBatch();
                    System.out.println("Seeded " + i + " categories");
                }
            }
            stmt.executeBatch();
        }
    }
    
    static void seedItems(Connection conn) throws SQLException {
        String sql = "INSERT INTO item (sku, name, price, stock, category_id, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (int i = 1; i <= 100000; i++) {
                long categoryId = ((i - 1) / 50) % 2000 + 1;
                stmt.setString(1, String.format("SKU%08d", i));
                stmt.setString(2, "Item " + i);
                stmt.setBigDecimal(3, new java.math.BigDecimal(10 + (i % 100) * 0.99));
                stmt.setInt(4, (i % 500) + 1);
                stmt.setLong(5, categoryId);
                stmt.setObject(6, LocalDateTime.now());
                stmt.addBatch();
                
                if (i % 1000 == 0) {
                    stmt.executeBatch();
                    System.out.println("Seeded " + i + " items");
                }
            }
            stmt.executeBatch();
            System.out.println("Total items seeded: 100000");
        }
    }
}
