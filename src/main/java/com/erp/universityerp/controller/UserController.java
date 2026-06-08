package com.erp.universityerp.controller;

import com.erp.universityerp.entity.User;
import com.erp.universityerp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        User existingUser =
                userService.login(user.getUsername());

        if(existingUser != null &&
                existingUser.getPassword().equals(user.getPassword())) {

            return existingUser;
        }

        return null;
    }

    @PostMapping("/create")
    public User createUser(@RequestBody User user) {

        if(user.getRole() == null || user.getRole().isEmpty()){
            user.setRole("USER");
        }

        return userService.register(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {

        user.setId(id);

        return userService.register(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User Deleted";
    }

    @PutMapping("/change-password/{username}")
    public User changePassword(@PathVariable String username,
                               @RequestBody User user){

        return userService.updatePassword(
                username,
                user.getPassword()
        );
    }
}