
package com.erp.universityerp.service;

import com.erp.universityerp.entity.AuditLog;
import com.erp.universityerp.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public AuditLog record(
            Long userId,
            String username,
            String role,
            String action,
            String module,
            String entityId,
            String description,
            String status,
            String ipAddress) {

        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setRole(role);
        log.setAction(action);
        log.setModule(module);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setStatus(status);
        log.setIpAddress(ipAddress);

        return repository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
