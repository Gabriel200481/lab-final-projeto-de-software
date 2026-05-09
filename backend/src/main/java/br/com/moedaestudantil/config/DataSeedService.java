package br.com.moedaestudantil.config;

import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;

@Singleton
public class DataSeedService {

    private final DataSource dataSource;

    public DataSeedService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Transactional
    public void seed() {
        try (var is = getClass().getClassLoader().getResourceAsStream("data.sql")) {
            if (is == null) {
                return;
            }
            String sql = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                for (String statement : sql.split(";")) {
                    String trimmed = statement.trim();
                    if (!trimmed.isEmpty()) {
                        stmt.execute(trimmed);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not seed data.sql: " + e.getMessage());
        }
    }
}
