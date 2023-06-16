package ru.kata.spring.boot_security.demo.services;


import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.BindingResult;
import ru.kata.spring.boot_security.demo.models.User;

public interface UserService extends UserDetailsService {
    Iterable<User> getAllUsers();
    void removeUserById(Long id);
    User saveNewUserProfile(User user);
    void checkUserProfile(User user, BindingResult bindingResult);
    User getById(Long id);

    User updateUserProfile(User user);

   Boolean isUserExistsWithEmail(String email);
}
