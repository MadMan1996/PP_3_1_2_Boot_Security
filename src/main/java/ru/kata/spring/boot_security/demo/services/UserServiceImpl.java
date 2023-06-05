package ru.kata.spring.boot_security.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import ru.kata.spring.boot_security.demo.DAO.UserRepository;
import ru.kata.spring.boot_security.demo.models.User;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Iterable<User> getAllUsers() {
       return userRepository.findAll();
    }
    @Transactional
    public void removeUserById(Long id) {
        userRepository.deleteById(id);
    }


    @Transactional
    public void saveNewUserProfile(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void checkUserProfile(User user, BindingResult bindingResult) {
        if(user.getPassword() ==null || user.getPassword().length()==0){
            bindingResult.rejectValue("password", "error.password", "Password shouldn`t be Empty");
        }
        if(user.getUserRoles().size()==0){
            bindingResult.rejectValue("userRoles", "error.userRoles", "User must have at least 1 role");
        }
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        return userRepository.findById(id).orElse(new User());
    }

    @Transactional
    public void updateUserProfile(User user) {
            userRepository.save(user);

    }

    @Transactional(readOnly = true)
    public Boolean isUserExistsWithEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public User loadUserByUsername(String email) {
        User user  = userRepository.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException(email);
        }
        return user;
    }
}
