package ru.kata.spring.boot_security.demo.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.DAO.RolesRepository;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class BDinit {
    @Autowired
    UserService userService;
    @Autowired
    RolesRepository rolesRepository;
    @PostConstruct
    public void initBD(){
        Role admin = new Role("ROLE_ADMIN");
        Role user  = new Role("ROLE_USER");

        User defaultUser = new User("Admin", "Admin", (byte) 18, null, null, "admin@mail.ru");
        User defaultUser2 = new User("User", "User", (byte) 21, null, null, "user@mail.ru");
        Set<Role> defaultUserRoles = new HashSet<>();
        defaultUserRoles.add(admin);
        defaultUser.setUserRoles(defaultUserRoles);
        defaultUser.setPassword("admin");
        defaultUser2.setPassword("user");
        defaultUser2.setUserRoles(defaultUserRoles);
        rolesRepository.save(user);
        rolesRepository.save(admin);
        userService.saveNewUserProfile(defaultUser);
        userService.saveNewUserProfile(defaultUser2);
    }
}
