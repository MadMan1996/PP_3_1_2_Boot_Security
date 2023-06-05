package ru.kata.spring.boot_security.demo.DAO;

import org.springframework.data.jpa.repository.EntityGraph;
import ru.kata.spring.boot_security.demo.models.User;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<User, Long> {
    boolean existsByEmail(String email);
    @EntityGraph(attributePaths = {"userRoles"})
    User findByEmail(String email);

}
