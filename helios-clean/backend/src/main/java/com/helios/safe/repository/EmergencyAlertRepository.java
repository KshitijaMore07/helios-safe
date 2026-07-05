package com.helios.safe.repository;
import com.helios.safe.model.EmergencyAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmergencyAlertRepository extends MongoRepository<EmergencyAlert, String> {
    List<EmergencyAlert> findByActiveTrue();
    List<EmergencyAlert> findTop5ByOrderByTimestampDesc();
}
