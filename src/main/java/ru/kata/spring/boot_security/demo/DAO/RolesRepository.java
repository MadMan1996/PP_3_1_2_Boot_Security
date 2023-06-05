package ru.kata.spring.boot_security.demo.DAO;

import org.springframework.data.repository.CrudRepository;
import ru.kata.spring.boot_security.demo.models.Role;
public interface RolesRepository extends CrudRepository<Role, Short> {
    Role getByRole(String roleName);
}
