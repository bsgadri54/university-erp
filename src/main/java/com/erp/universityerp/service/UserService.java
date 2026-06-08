package com.erp.universityerp.service;

import com.erp.universityerp.entity.User;
import com.erp.universityerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User login(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updatePassword(String username, String password) {

        User user = userRepository.findByUsername(username);

        if(user != null){

            user.setPassword(password);

            return userRepository.save(user);
        }

        return null;
    }
}