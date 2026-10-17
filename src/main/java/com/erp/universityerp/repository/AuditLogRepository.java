
package com.erp.universityerp.repository;

import com.erp.universityerp.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

    List<AuditLog> findByUsernameOrderByCreatedAtDesc(
            String username);

    List<AuditLog> findByModuleOrderByCreatedAtDesc(
            String module);
}
