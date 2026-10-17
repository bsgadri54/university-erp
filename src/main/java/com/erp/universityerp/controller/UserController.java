
package com.erp.universityerp.controller;

import com.erp.universityerp.entity.User;
import com.erp.universityerp.service.AuditLogService;
import com.erp.universityerp.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;
    private final AuditLogService auditLogService;

    public UserController(
            UserService userService,
            AuditLogService auditLogService) {
        this.userService = userService;
        this.auditLogService = auditLogService;
    }

    private void logEvent(
            Long userId,
            String username,
            String role,
            String action,
            String description,
            String status,
            HttpServletRequest request) {

        auditLogService.record(
                userId,
                username,
                role,
                action,
                "USER_MANAGEMENT",
                userId == null ? null : userId.toString(),
                description,
                status,
                request.getRemoteAddr()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user,
            HttpServletRequest request) {

        User existingUser =
                userService.login(user.getUsername());

        if (existingUser != null
                && existingUser.getPassword() != null
                && existingUser.getPassword()
                .equals(user.getPassword())) {

            logEvent(
                    existingUser.getId(),
                    existingUser.getUsername(),
                    existingUser.getRole(),
                    "LOGIN_SUCCESS",
                    "Login accepted by legacy password check",
                    "SUCCESS",
                    request
            );

            // Do not return the stored password.
            existingUser.setPassword(null);

            return ResponseEntity.ok(existingUser);
        }

        logEvent(
                null,
                user.getUsername(),
                "UNKNOWN",
                "LOGIN_FAILED",
                "Login attempt failed",
                "FAILURE",
                request
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of(
                        "message", "Invalid username or password"
                ));
    }

    @PostMapping("/create")
    public ResponseEntity<User> createUser(
            @RequestBody User user,
            HttpServletRequest request) {

        if (user.getRole() == null
                || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        User savedUser = userService.register(user);

        logEvent(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole(),
                "USER_CREATED",
                "User account created",
                "SUCCESS",
                request
        );

        savedUser.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // Never expose stored passwords in API responses.
        users.forEach(user -> user.setPassword(null));

        return users;
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user,
            HttpServletRequest request) {

        user.setId(id);

        User updatedUser = userService.register(user);

        logEvent(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getRole(),
                "USER_UPDATED",
                "User account updated",
                "SUCCESS",
                request
        );

        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id,
            HttpServletRequest request) {

        userService.deleteUser(id);

        logEvent(
                null,
                "UNKNOWN",
                "UNKNOWN",
                "USER_DELETED",
                "User account deleted; affected user ID: " + id,
                "SUCCESS",
                request
        );

        return ResponseEntity.ok("User deleted");
    }

    @PutMapping("/change-password/{username}")
    public ResponseEntity<?> changePassword(
            @PathVariable String username,
            @RequestBody User user,
            HttpServletRequest request) {

        User updatedUser = userService.updatePassword(
                username,
                user.getPassword()
        );

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        logEvent(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getRole(),
                "PASSWORD_CHANGED",
                "Password update requested through legacy endpoint",
                "SUCCESS",
                request
        );

        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }
}
