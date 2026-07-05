package com.helios.safe.repository;
import com.helios.safe.model.TemperatureReading;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TemperatureRepository extends MongoRepository<TemperatureReading, String> {
    List<TemperatureReading> findTop10ByOrderByTimestampDesc();
}
