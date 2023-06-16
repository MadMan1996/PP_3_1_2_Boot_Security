package ru.kata.spring.boot_security.demo.controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api")
public class RestController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public Iterable<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/users/auth")
    public User getAllUsers(@AuthenticationPrincipal User user){
        return userService.getById(user.getId());
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") Long id){
        return userService.getById(id);
    }

    @PostMapping("/users")
    public ResponseEntity<User> saveUser(@RequestBody User user){
        System.out.println(user);
        User savedUser = userService.saveNewUserProfile(user);
        return new ResponseEntity<User>(savedUser, HttpStatus.CREATED);
    }

    @PatchMapping("/users/{id}")
    public User updateUser(@RequestBody User user){
        System.out.println(user);
        System.out.println("--------------------------------Updating");
        return userService.updateUserProfile(user);
    }

    @DeleteMapping("/users/{id}")
    public void updateUser(@PathVariable Long id){
       userService.removeUserById(id);
    }


}
