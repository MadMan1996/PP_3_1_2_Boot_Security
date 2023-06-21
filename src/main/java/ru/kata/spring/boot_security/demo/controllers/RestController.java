package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import ru.kata.spring.boot_security.demo.DAO.RolesRepository;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private UserService userService;
    @Autowired
    private RolesRepository rolesRepository;

    @GetMapping("/main")
    public ResponseEntity<Resource> getView(){
        Resource htmlView = new ClassPathResource("/templates/user/RESTView.html");
        HttpHeaders viewHeaders = new HttpHeaders();
        viewHeaders.setContentType(MediaType.TEXT_HTML);
        return new ResponseEntity<>(htmlView, viewHeaders, HttpStatus.OK);
    }
    @GetMapping("api/roles/management")
    public Iterable<Role> getRoles(){
        return rolesRepository.findAll();
    }


    @GetMapping("api/users/management")
    public Iterable<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("api/users/auth")
    public User getAllUsers(@AuthenticationPrincipal User user){
        return userService.getById(user.getId());
    }

    @GetMapping("api/users/management/{id}")
    public User getUser(@PathVariable("id") Long id){
        return userService.getById(id);
    }

    @PostMapping("api/users/management")
    public ResponseEntity<User> saveUser(@RequestBody User user){
        System.out.println(user);
        User savedUser = userService.saveNewUserProfile(user);
        return new ResponseEntity<User>(savedUser, HttpStatus.CREATED);
    }

    @PatchMapping("api/users/management/{id}")
    public User updateUser(@RequestBody User user){
        System.out.println(user);
        System.out.println("--------------------------------Updating");
        return userService.updateUserProfile(user);
    }

    @DeleteMapping("api/users/management/{id}")
    public void updateUser(@PathVariable Long id){
       userService.removeUserById(id);
    }

}
